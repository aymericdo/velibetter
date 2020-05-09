import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  private icons = {
    twitter: 'assets/twitter.svg',
    linkedin: 'assets/linkedin.svg',
    web: 'assets/web.png'
  }

  private messages = [
    { icon: 'view_list', content: 'liste de stations avec score intelligent' },
    { icon: 'navigation', content: 'navigation jusqu\'aux stations' },
    { icon: 'compass_calibration', content: 'mode boussole pendant la navigation' },
    { icon: 'feedback', content: 'correction participative en temps réel' },
    { icon: 'timeline', content: 'algorithme prédictif pour un trajet dans le futur' }
  ];

  private team = [
    {
      name: 'Aymeric Domnique', avatar: 'assets/images/aymeric.jpeg', job: 'Développeur front-end', socials: [
        { type: 'linkedin', link: 'https://www.linkedin.com/in/aymeric-dominique/' }
      ]
    },
    {
      name: 'Thomas Legrand', avatar: 'assets/images/thomas.jpeg', job: 'Data Scientist', socials: [
        {
          type: 'twitter',
          link: 'https://twitter.com/thomasd_legrand'
        },
        {
          type: 'linkedin',
          link: 'https://www.linkedin.com/in/thomas-d-legrand/'
        },
        {
          type: 'web',
          link: 'https://www.thomaslegrand.tech'
        }
      ]


    }
  ]
  constructor() { }

  ngOnInit() {
  }

}
