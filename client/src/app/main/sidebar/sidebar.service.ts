import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SidebarService {
    private isSidebarOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    isSidebarOpen$ = this.isSidebarOpen.asObservable();

    public toggleSidebar(): void {
        this.isSidebarOpen.next(!this.isSidebarOpen.value);
    }
}