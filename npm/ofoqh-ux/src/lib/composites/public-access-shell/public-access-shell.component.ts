import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

export type UxPublicAccessShellLink = {
  label: string;
  route: string;
};

@Component({
  selector: 'ofoqh-ux-public-access-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
  ],
  templateUrl: './public-access-shell.component.html',
  styleUrl: './public-access-shell.component.scss',
})
export class UxPublicAccessShellComponent {
  @Input() appName = 'App';
  @Input() homeUrl = '/';
  @Input() loginUrl = '';
  @Input() loginLabel = 'Sign in';
  @Input() loginIcon = 'login';
  @Input() bannerText: string | null = null;
  @Input() navLinks: readonly UxPublicAccessShellLink[] = [];
  @Input() heroEyebrow = '';
  @Input() heroTitle = '';
  @Input() heroBody = '';
  @Input() heroBullets: readonly string[] = [];
  @Input() footerText = '';
}
