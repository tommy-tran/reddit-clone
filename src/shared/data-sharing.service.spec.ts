import { DataSharingService } from "./data-sharing.service";
import { Post } from "../models/post.model";

describe('DataSharingService test suite', () => {
    let service: DataSharingService;

    beforeEach(() => { service = new DataSharingService() });

    it('Should get/set screen width properly', () => {
        service.setScreenX(150);
        let width = service.getScreenX();
        expect(width).toBe(150);
    });
    it('Should get/set screen height properly', () => {
        service.setScreenY(350);
        let width = service.getScreenY();
        expect(width).toBe(350);
    });
    it('Should get/set isMobile property properly', () => {
        service.setIsMobile(true);
        let isMobile = service.getIsMobile();
        expect(isMobile).toBe(true);
    });
    it('Should sort posts by SORT_METHOD correctly', () => {
        let post1 = new Post(
            "Look at all these pumpkins! ",
            "http://pumpkinnook.com/artwork/pumpkin-2016-09-02.jpg",
            "-KweZeFwL-NqVCE9p4W3",
            "",
            "fall",
            "-KwR0TEzaIXFia_V2LYO",
            1508247774339,
            "kathryn",
            "zqbCBpoLTyPKNjYWZuDomNBgNzw1",
            0,
            0);
        let post2 = new Post(
            "pumpkins",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Pumpkins.jpg/350px-Pumpkins.jpg",
            "-KweZmoQHhtnEHoMQLyi",
            null,
            "fall",
            "-KwR0TEzaIXFia_V2LYO",
            1508247809376,
            "kathryn",
            "zqbCBpoLTyPKNjYWZuDomNBgNzw1",
            3,
            0, );
        let post3 = new Post(
            "My grades are falling",
            null,
            "-Kwec4PweQAh67TNKcyv",
            "nooooooo",
            "fall",
            "-KwR0TEzaIXFia_V2LYO",
            1508248671996,
            "jimmy",
            "nYfkvkvOuOQ6z7cNWYHhUBhEL4k1",
            3,
            1);
        let posts = [post1, post2, post3];
        console.log(posts);
        //1,3,2
        let sortedByNew = service.sortBy(posts, 'new');
        console.log(sortedByNew);
        //2,3,1
        // let sortedByTop = service.sortBy(posts, 'top');
        // console.log(sortedByTop);
        // //3,2,1
        // let sortedByHot = service.sortBy(posts, 'hot');
        // console.log(sortedByHot);

        expect(sortedByNew[0].timestamp).toBe(1508247774339);
        expect(sortedByNew[1].timestamp).toBe(1508248671996);
        expect(sortedByNew[2].timestamp).toBe(1508247809376);
        
        // expect(sortedByTop[0].timestamp).toBe(1508247809376);
        // expect(sortedByTop[1].timestamp).toBe(1508248671996);
        // expect(sortedByTop[2].timestamp).toBe(1508247774339);
        
        // expect(sortedByHot[0].timestamp).toBe(1508248671996);
        // expect(sortedByHot[1].timestamp).toBe(1508247809376);
        // expect(sortedByHot[2].timestamp).toBe(1508247774339);
    });


});