+++
title = "Splitting up Liquibase JSON changelogs"
description = """
A quick trick to automatically split up large changelogs and group related
changesets.
"""
slug="split-liquibase-changelog"
date = 2021-09-09
+++

When migrating to [Liquibase](https://liquibase.com) for your database
deployments, a common practice is to create a starting point from an existing
schema in a database using the
[`generate-changelog`](https://docs.liquibase.com/commands/community/generatechangelog.html)
command. This command generates a Liquibase changelog which will recreate your
schema when you run `$ liquibase update`.

Unfortunately, at least in the [open source version](https://liquibase.org),
this command generates a single file containing all the changes. I haven't tried
the "Pro" version of Liquibase, but it can apparently split up the changelog by
creating auxiliary files for the different types of database object. 

If your existing schema already has a lot of tables, the generated changelog can
be huge, even just for the tables, indexes, and foreign keys. This can be quite
an organisational nightmare, and is difficult to read through manually.

But if you do want to split up your changelog, and you use the [JSON changelog
format](https://docs.liquibase.com/concepts/basic/json-format.html), some
[`jq`](https://stedolan.github.io/jq) magic might just do the trick. Combine it
with some Bash and you can fully automate the splitting process that would be
otherwise incredibly tedious.

Here's a `jq` program that splits up a single changelog into smaller changelogs
that all relate to a single table - including the `createTable`,
`createIndex`, and `addForeignKeyConstraint` changes:

```bash
# Define a function for mapping a changes onto its destination file name
# createTable and createIndex use the tableName field
# addForeignKeyConstraint uses baseTableName
# Default to using the name of the change, e.g. createSequence
def get_change_group: map(.tableName // .baseTableName)[0] // keys[0];

# Select the main changelog object
.databaseChangeLog
# Collect the changes from each changeSet into an array
| map(.changeSet.changes | .[])
# Group changes according to the grouping function
| group_by(get_change_group)
# Select the grouped objects from the array
| .[]
# Get the group name from each group
| (.[0] | get_change_group) as $group_name
# Select both the group name...
| $group_name,
# and the group, wrapped in a changeSet that uses the group name in the ID and
# the current user as the author
  { databaseChangelog: {
      changeSet: {
      id: ("table_" + $group_name),
      author: env.USER,
      changes: . } } }
```
Save this program as `split_liquibase_changelog.jq`. Using, e.g., a Bash script,
you can use this to split changelogs into smaller files. But first, we need
another program to generate a main changelog file. This one will simply include
all of the generated changelogs:


Finally, here's a Bash script that ties it all together:

```bash
#!/usr/bin/env bash
# Example: ./split_liquibase_changelog.sh schema < changelog.json

set -e -o noclobber

OUTPUT_DIRECTORY="${1:-schema}"
OUTPUT_FILE="${2:-schema.json}"

# Create the output directory
mkdir --parents "$OUTPUT_DIRECTORY"

# --raw-output: don't quote the strings for the group names
# --compact-output: output one JSON object per line
jq \
    --raw-output \
    --compact-output \
    --from-file split_liquibase_changelog.jq \
| while read -r group; do # Read the group name line
    # Read the JSON object line
    read -r json
    # Process with jq again to pretty-print the object, then redirect it to the
    # new file
    (jq '.' <<< "$json") \
        > "$OUTPUT_DIRECTORY"/"$group".json
done

# List all the files in the input directory
# Run jq with --raw-input, so input is parsed as strings
# Create a changelog that includes everything in the input path
# Save the output to the desired output file
(jq \
    --raw-input \
    '{ databaseChangeLog: [
        { includeAll:
            { path: . }
        }
     ] }' \
    <<< "$OUTPUT_DIRECTORY"/) \
    > "$OUTPUT_FILE"
```

Alternatively, if you'd prefer explicitly including each smaller changeset,
instead use the following at the end of the script:

```bash
# List all the files in the input directory
# Run jq with:
# --null-input: don't read the input, so `inputs` refers to ALL the inputs
# --raw-input: parse input as strings
# Save the output to the desired output file
find "$OUTPUT_DIRECTORY" -type f \
| jq \
    --null-input \
    --raw-input \
    '
    # Wrap all the inputs (file names) into an array
    [inputs]
    # Create the main changelog object with an include for each file
    | { databaseChangeLog:
        map({
            include: {
                file: .
            }
        })
      }
    ' \
    > "$OUTPUT_FILE"
```

Now you can run `$ ./split_liquibase_changelog.sh schema schema.json <
changelog.json` and enjoy your beautifully organised changelogs! Make sure to
check everything is correct and organised as you want it.

Feel free to adjust the programs if you want to tweak how things are organised,
you may want to adjust:

- The files that don't relate to any table - these will be
  named by the command, e.g. `createSequence`.
- The IDs of the changesets in these files, which will be nonsensically prefixed
  with `table_`.
- The grouping function `get_change_group` in `generate_liquibase_includes`
- How the smaller changelog files group all the changes into a single changeset

Take a look at [jqplay](https://jqplay.org) if you want to fiddle with `jq`
programs.

# Example

Here's a contrived example based on my Nextcloud instance's database.

<details>
<summary>Generated changelog</summary>

```json
{ "databaseChangeLog": [
  {
    "changeSet": {
      "id": "1631138109568-75",
      "author": "william (generated)",
      "changes": [
        {
          "createTable": {
            "columns": [
              {
                "column": {
                  "autoIncrement": true,
                  "constraints": {
                    "nullable": false,
                    "primaryKey": true,
                    "primaryKeyName": "oc_news_feeds_pkey"
                  },
                  "name": "id",
                  "type": "BIGINT"
                }
              },
              {
                "column": {
                  "constraints": {
                    "nullable": false
                  },
                  "defaultValueNumeric": 0,
                  "name": "update_mode",
                  "type": "INTEGER"
                }
              }]
              ,
              "tableName": "oc_news_feeds"
          }
        }]
    }
  },
  {
    "changeSet": {
      "id": "1631138109568-240",
      "author": "william (generated)",
      "changes": [
        {
          "addForeignKeyConstraint": {
            "baseColumnNames": "feed_id",
            "baseTableName": "oc_news_items",
            "constraintName": "feed",
            "deferrable": false,
            "initiallyDeferred": false,
            "onDelete": "CASCADE",
            "onUpdate": "NO ACTION",
            "referencedColumnNames": "id",
            "referencedTableName": "oc_news_feeds",
            "validate": true
          }
        }]
    }
  },
  {
    "changeSet": {
      "id": "1631138109568-236",
      "author": "william (generated)",
      "changes": [
        {
          "createIndex": {
            "columns": [
              {
                "column": {
                  "defaultValueNumeric": 0,
                  "name": "last_modified"
                }
              }]
              ,
              "indexName": "news_feeds_last_mod_idx",
              "tableName": "oc_news_feeds"
          }
        }]
    }
  },
  {
    "changeSet": {
      "id": "1631138109568-241",
      "author": "william (generated)",
      "changes": [
        {
          "createIndex": {
            "columns": [
              {
                "column": {
                  "defaultValueNumeric": 0,
                  "name": "last_modified"
                }
              }]
              ,
              "indexName": "news_items_last_mod_idx",
              "tableName": "oc_news_items"
          }
        }]
    }
  }
]}
```
</details>

New files created after running `split_liquibase_changelog.sh`:

<details>
<summary>schema/oc_news_feeds.json</summary>

```json
{
  "databaseChangelog": {
    "changeSet": {
      "id": "table_oc_news_feeds",
      "author": "william",
      "changes": [
        {
          "createTable": {
            "columns": [
              {
                "column": {
                  "autoIncrement": true,
                  "constraints": {
                    "nullable": false,
                    "primaryKey": true,
                    "primaryKeyName": "oc_news_feeds_pkey"
                  },
                  "name": "id",
                  "type": "BIGINT"
                }
              },
              {
                "column": {
                  "constraints": {
                    "nullable": false
                  },
                  "defaultValueNumeric": 0,
                  "name": "update_mode",
                  "type": "INTEGER"
                }
              }
            ],
            "tableName": "oc_news_feeds"
          }
        },
        {
          "createIndex": {
            "columns": [
              {
                "column": {
                  "defaultValueNumeric": 0,
                  "name": "last_modified"
                }
              }
            ],
            "indexName": "news_feeds_last_mod_idx",
            "tableName": "oc_news_feeds"
          }
        }
      ]
    }
  }
}
```
</details>

<details>
<summary>schema/oc_news_items.json</summary>

```json
{
  "databaseChangelog": {
    "changeSet": {
      "id": "table_oc_news_items",
      "author": "william",
      "changes": [
        {
          "addForeignKeyConstraint": {
            "baseColumnNames": "feed_id",
            "baseTableName": "oc_news_items",
            "constraintName": "feed",
            "deferrable": false,
            "initiallyDeferred": false,
            "onDelete": "CASCADE",
            "onUpdate": "NO ACTION",
            "referencedColumnNames": "id",
            "referencedTableName": "oc_news_feeds",
            "validate": true
          }
        },
        {
          "createIndex": {
            "columns": [
              {
                "column": {
                  "defaultValueNumeric": 0,
                  "name": "last_modified"
                }
              }
            ],
            "indexName": "news_items_last_mod_idx",
            "tableName": "oc_news_items"
          }
        }
      ]
    }
  }
}
```
</details>

<details>
<summary>schema.json</summary>

```json
{
  "databaseChangeLog": [
    {
      "include": {
        "file": "schema/oc_news_items.json"
      }
    },
    {
      "include": {
        "file": "schema/oc_news_feeds.json"
      }
    }
  ]
}
```
</details>
