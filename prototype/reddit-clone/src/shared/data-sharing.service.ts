import { Injectable } from "@angular/core";

@Injectable()
export class DataSharingService {
    screenX: number;
    screenY: number;
    isMobile: boolean;
    constructor() {}
    getScreenX() {
        return this.screenX;
    }

    setScreenX(width: number) {
        this.screenX = width;
    }
    getScreenY() {
        return this.screenY;
    }

    setScreenY(height: number) {
        this.screenY = height;
    }
    getIsMobile() {
        return this.isMobile;
    }

    setIsMobile(isMobile: boolean) {
        this.isMobile = isMobile;
    }
}