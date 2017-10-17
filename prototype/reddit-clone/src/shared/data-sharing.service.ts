import { Injectable } from "@angular/core";
import { Post } from "../models/post.model";

@Injectable()
export class DataSharingService {
    screenX: number;
    screenY: number;
    isMobile: boolean;
    constructor() { }
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
    /**
     * Sort posts by a sort method
     * @param posts array of posts
     * @param sortMethod method to sort by
     */
    sortBy(posts: Post[], sortMethod: string) {
        console.log(sortMethod);
        let currentDate = new Date();
        let currentTime = currentDate.getTime();
        function relativeDiff(A, B) {
            B = currentTime - B;
            return Math.abs(A - B) / B;
        }
        //insertion sort for top posts
        function insertionSortTop() {
            var len = posts.length;
            for (var i = 1; i < len; i++) {
                var tmp = posts[i]; //Copy of the current element. 
                /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
                for (var j = i - 1; j >= 0 && (posts[j]["score"] < tmp["score"]); j--) {
                    //Shift the number
                    posts[j + 1] = posts[j];
                }
                //Insert the copied number at the correct position
                //in sorted part. 
                posts[j + 1] = tmp;
            }
        }
        //insertion sort for most recent posts
        function insertionSortNew() {
            var len = posts.length;
            for (var i = 1; i < len; i++) {
                var tmp = posts[i]; //Copy of the current element. 
                /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
                for (var j = i - 1; j >= 0 && (posts[j]["timestamp"] < tmp["timestamp"]); j--) {
                    //Shift the number
                    posts[j + 1] = posts[j];
                }
                //Insert the copied number at the correct position
                //in sorted part. 
                posts[j + 1] = tmp;
            }
        }
        //insertion sort for popular posts
        function insertionSortHot() {
            var len = posts.length;
            for (var i = 1; i < len; i++) {
                var tmp = posts[i]; //Copy of the current element. 
                /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
                for (var j = i - 1; j >= 0 && (relativeDiff(posts[j]["score"], posts[j]["timestamp"]) > relativeDiff(tmp["score"], tmp["timestamp"])); j--) {
                    //Shift the number
                    posts[j + 1] = posts[j];
                }
                //Insert the copied number at the correct position
                //in sorted part. 
                posts[j + 1] = tmp;
            }
        }

        switch (sortMethod) {
            case 'hot':
                insertionSortHot();
                break;
            case 'new':
                insertionSortNew();
                break;
            case 'top':
                insertionSortTop();
                break;

        }
        console.log(posts);
        return posts;
    }
}