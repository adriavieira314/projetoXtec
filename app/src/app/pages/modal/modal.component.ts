import { Component, Input, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap/modal";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html'
})
export class ModalComponent {
    //funcoes modal
    @ViewChild('autoShownModal') autoShownModal: ModalDirective;
    isModalShown = false;
    
    showModal(): void {
        this.isModalShown = true;
    }
    
    hideModal(): void {
        this.autoShownModal.hide();
    }
    
    onHidden(): void {
        this.isModalShown = false;
    }
    //fim 
}