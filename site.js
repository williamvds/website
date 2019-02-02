var data = {
	name:	  "William Vigolo da Silva",
	headline: "Software developer, computer person",
	username: "williamvds",
	address:  "13 Cian House, 10 Bard Road, London, W10 6TP",
	contacts: {
		phone: {prefix: "tel:",		text: "+44 747 194 3791"},
		email: {prefix: "mailto:",	text: "william@williamvds.me"},
		web:   {prefix: "https://", text: "williamvds.me"},
	},
	accounts: [
		{name: "LinkedIn", icon: "linkedin-box",  url: "https://linkedin.com/in/"},
		{name: "GitHub",   icon: "github-circle", url: "https://github.com/"},
	],
	hide: {
		references: window.matchMedia("print"),
	}
};

function formatDate(date) {
	return date.toLocaleDateString("en-GB", {year: "numeric", month: "short"});
}

function dateDiff(start, end) {
	var diff = end.getMonth() - start.getMonth()
		+ 12 * (end.getFullYear() - start.getFullYear());

	var years  = Math.floor(diff / 12),
		months = diff % 12,
		string = "";

	if (years > 0)
		string += years + " year" + (years > 1 ? "s" : "");

	if (months > 0)
		string += (years > 0 ? ", " : "") + months + " month" + (months > 1 ? "s" : "");

	return string;
}

Vue.component("contact", {
	props: ["icon", "link", "text"],
	template: `
	<div class=contact>
		<span class=iconify :data-icon='\"mdi-\"+icon'></span>
		<a :href=link>{{text}}</a>
	</div>`,
});

Vue.component("account", {
	props: ["site", "icon", "link", "text"],
	template: `
	<a class=account :title=site :href=link>
		<span class=iconify :data-icon='\"mdi-\"+icon'></span>{{text}}
	</a>`,
});

Vue.component("skill", {
	props: ["id", "title"],
	template: `
	<div class=skill v-if=show>
		<h2>{{title}}</h2>
		<slot></slot>
	</div>`,
	computed: {
		show: function() { return !data.hide[this.id]; },
	}
});

Vue.component("category", {
	props: ["id", "icon", "title"],
	template: `
	<section class=category :id=id v-show=show>
		<div class=categoryTitle>
			<h1 class=icon>
				<span class=iconify :data-icon='\"mdi-\"+icon'></span>
			</h1>
			<h1>{{title}}</h1>
		</div>
		<slot></slot>
	</section>`,
	computed: {
		show: function() {
			return !data.hide[this.id]
				&& this.$slots.default != undefined;
		},
	}
});

Vue.component("project", {
	props: ["id", "title", "tech", "url"],
	template: `
	<section class=project v-if=show>
		<div class=projectTitle>
			<h2><a :href=url>{{title}}</a></h2>
			<p>&#8211; {{tech}}</p>
		</div>
		<slot></slot>
	</section>`,
	computed: {
		show: function() { return !data.hide[this.id]; },
	}
});

Vue.component("position", {
	props: ["id", "title", "organisation", "url", "date", "start", "end"],
	template: `
	<div class=position :id=id v-if=show>
		<div class=positionTitle>
			<h2 class=org><a :href=url>{{organisation}}</a></h2>
			<h3 class=date v-if=date>{{dateString}}</h3>
			<h3 class=date v-if=start>
				{{period}}
				<span class=duration v-if=showDuration> ({{duration}})</span>
			</h3>
		</div>
		<h3 class=title>{{title}}</h3>
		<slot></slot>
	</div>`,
	computed: {
		show: 		 	 function() { return !data.hide[this.id]; },
		showDuration:	 function() { return !data.hide.duration; },
		dateString:		 function() { return formatDate(new Date(this.date)); },
		startDate:       function() { return new Date(this.start); },
		startDateString: function() { return formatDate(this.startDate); },
		endDate: function() {
			return this.end ? new Date(this.end) : new Date();
		},
		endDateString: function() {
			return this.end
				? formatDate(this.end ? new Date(this.end) : new Date())
				: "Present";
		},
		duration: function() { return dateDiff(this.startDate, this.endDate); },
		period: function() {
			if (this.end == null) {
				return `Since ${this.startDateString}`;
			}

			return `${this.startDateString} – ${this.endDateString}`;
		}
	},
});

window.addEventListener("load", function() {
	var app = new Vue({
		el: "#app",
		data: data,
	});
});
