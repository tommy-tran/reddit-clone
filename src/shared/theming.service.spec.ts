import { SettingsProvider } from "./theming.service";
import { Storage } from "@ionic/storage";
import { Events } from "ionic-angular";
describe('SettingsProvider test suite', () => {
    let service: SettingsProvider;
    let storage: Storage;
    let events: Events;
    beforeEach(() => service = new SettingsProvider(storage, events));

    it('Should correctly get/set app theme name', () => {
        service.setActiveTheme('test-theme');
        let theme;
        service.getActiveTheme().subscribe((val) => {
            theme = val;
            expect(theme).toBe('test-theme');
            expect(service.getThemeAsString()).toBe('test-theme');
        });
    });
});