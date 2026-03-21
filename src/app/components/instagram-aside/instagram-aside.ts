import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instagram-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instagram-aside.html',
  styleUrl: './instagram-aside.scss'
})
export class InstagramAsideComponent {
  instagramUrl = 'https://instagram.com/mjescritora3';
  instagramUser = '@mjescritora3';
}
