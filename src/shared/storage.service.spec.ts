import { StorageService } from "./storage.service";
import { Storage } from "@ionic/storage";
describe('StorageService test suite', () => {
    let service: StorageService;
    let storage: Storage
    beforeEach(() => service = new StorageService(storage));

    it('Should get/set initially subscribed subreddits properly', () => {
        let initSubreddits_initial = [
            {
                name: 'TestABC',
                id: 1
            },
            {
                name: 'Test123',
                id: 2
            }
        ]
        service.setInitSubreddits(initSubreddits_initial);
        let initSubreddits_final = service.getInitSubreddits()
        expect(initSubreddits_final[0].name).toBe('TestABC');
        expect(initSubreddits_final[0].id).toBe(1);
        expect(initSubreddits_final[1].name).toBe('Test123');
        expect(initSubreddits_final[1].id).toBe(2);
    });
    it('Should store/retrieve subscribed subreddits to storage properly', () => {
        let subscribed_test = [
            {
                name: 'TestABC',
                id: 1
            },
            {
                name: 'Test123',
                id: 2
            }
        ]
        service.setSubscribedSubreddits(subscribed_test).then(() => {
            service.getSubscribedSubreddits().then((subreddits) => {
                expect(subreddits[0].name).toBe('TestABC');
                expect(subreddits[0].id).toBe(1);
                expect(subreddits[1].name).toBe('Test123');
                expect(subreddits[1].id).toBe(2);
            });
        });
    });
    it('Should properly check if a user has a subreddit in their subscribed list', () => {
        let subscribed_test = [
            {
                name: 'TestABC',
                id: 1
            },
            {
                name: 'Test123',
                id: 2
            }
        ]
        service.setSubscribedSubreddits(subscribed_test).then(() => {
            let t1 = service.isSubscribed('' + subscribed_test[0].id);
            let t2 = service.isSubscribed('' + subscribed_test[1].id);
            let t3 = service.isSubscribed('25');

            expect(t1).toBe(true);
            expect(t2).toBe(true);
            expect(t3).toBe(false);
        });
    });
});