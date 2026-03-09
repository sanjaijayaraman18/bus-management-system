import { Component } from '@angular/core';
import { Location, CommonModule } from '@angular/common';

@Component({
    selector: 'app-back-button',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button (click)="goBack()" class="btn btn-back animate__animated animate__fadeInLeft">
      <i class="bi bi-arrow-left-short fs-4"></i>
      <span>Back</span>
    </button>
  `,
    styles: [`
    .btn-back {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      border-radius: 10px;
      padding: 0.4rem 1rem 0.4rem 0.6rem;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 1.5rem;
      backdrop-filter: blur(8px);
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: #fff;
      transform: translateX(-4px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-back i {
      transition: transform 0.3s ease;
    }

    .btn-back:hover i {
      transform: translateX(-2px);
    }
  `]
})
export class BackButtonComponent {
    constructor(private location: Location) { }

    goBack(): void {
        this.location.back();
    }
}
