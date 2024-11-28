import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarService } from '../sidebar/sidebar.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
})
export class HeaderComponent {
    constructor(private sidebarService: SidebarService) { }

    public toggleSidebar(): void {
        this.sidebarService.toggleSidebar();
    }

    @Output() eventEmitter = new EventEmitter<string>();
    click(value: string) {
        this.eventEmitter.emit(value);
    }
}
