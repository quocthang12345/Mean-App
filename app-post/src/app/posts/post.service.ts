import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

@Injectable({providedIn: "root"})
export class PostService{
  posts: Post[] = []

  private subject = new Subject<{posts: Post[], totalPost: number}>();

  constructor(private http: HttpClient, public router: Router){}

  getPosts(pageSize: number, currentPage: number){
    const queryURL = `?pagesize=${pageSize}&currentpage=${currentPage}`
    this.http.get<{message:String, data: any, totalPost: number}>(`${environment.apiUrl}/posts` + queryURL)
    .pipe(map(postData => {
      return {
        postPaginator: postData.data.map((post: { _id: { toString: () => any; }; name: any; description: any; content: any; imagePath: any, creator: any}) => {
          return {
            id: post._id.toString(),
            name: post.name,
            description: post.description,
            content: post.content,
            imagePath: post.imagePath,
            creator: post.creator
          }
        }),
        totalPost:postData.totalPost
      }
    }))
    .subscribe(transformPostsData => {
      this.posts = transformPostsData.postPaginator;
      this.subject.next({posts: [...transformPostsData.postPaginator],totalPost:transformPostsData.totalPost}); // thông báo đến các event về một bản sao được cập nhật
    })
  }

  getOnePost(id: string){
     return this.http.get<{_id: string, name: string, description: string, content:string, imagePath:string, creator: string}>(`${environment.apiUrl}/posts/${id}`)
  }

  getUpdatePostListener(){
    return this.subject.asObservable();
  }

  addPost(name:string ,description: string, content: string, image: File){
      const formData = new FormData()
      formData.append("id","")
      formData.append("name", name)
      formData.append("description", description)
      formData.append("content", content)
      formData.append("image", image, name);
      this.http.post<{message:String}>(`${environment.apiUrl}/addPost`, formData).subscribe(responseMessage => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(post: any){
    let postUpdate: any;
    if(typeof(post.imagePath) == "object"){
      postUpdate = new FormData();
      postUpdate.append("id",post.id)
      postUpdate.append("name", post.name)
      postUpdate.append("description", post.description)
      postUpdate.append("content", post.content)
      postUpdate.append("image", post.imagePath, post.name);
    }else{
      postUpdate = {
        id:post.id,
        name: post.name,
        description: post.description,
        content: post.content,
        imagePath: post.imagePath
      }
    }
    this.http.put<{message: string}>(`${environment.apiUrl}/updatePost`, postUpdate).subscribe(responseMessage => {
      this.router.navigate(["/"]);
    })
  }

  deletePost(id: String){
    return this.http.delete<{message:String}>(`${environment.apiUrl}/deletePost/${id}`);
  }
}
