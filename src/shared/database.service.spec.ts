import { DatabaseService } from './database.service';

describe('DatabaseService without the TestBed', () => {
    let service: DatabaseService;
   
    beforeEach(() => { service = new DatabaseService(); });
   
    it('should return 1', () => {
      service.getKarma('jammy').then((value) => {
          expect(value).toBe('1')
      });
    });
    
   
  });