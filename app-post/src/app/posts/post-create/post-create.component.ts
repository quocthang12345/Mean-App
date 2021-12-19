import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy{
    private postId: any;
    public post: Post = {id:"", name:"",description:"", content:"" , imagePath: "", creator: ""};
    public form: FormGroup = new FormGroup({
      'name' : new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)]
      }),
      'description' : new FormControl(null, {
        validators: [Validators.required]
      }),
      'content' : new FormControl(null, {
        validators: [Validators.required]
      }),
      'image' : new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    public authSub!: Subscription;
    imagePreview: any;
    isLoading = false
    // @Output() postCreated = new EventEmitter<Post>();

    constructor(public postService: PostService,public authService: AuthService, public route: ActivatedRoute){}

    ngOnInit(){
      this.authSub = this.authService.getAuthListener().subscribe(isAuth => {
        this.isLoading = isAuth;
      })

      this.route.paramMap.subscribe(paramMaps => {
        if(paramMaps.has("postId")){
          this.postId = paramMaps.get("postId");
          console.log(this.postId)
          this.postService.getOnePost(this.postId).subscribe(postData => {
            this.post = {id: postData._id, name: postData.name, description: postData.description, content: postData.content, imagePath: postData.imagePath, creator: ""}
            this.form.setValue({name: this.post.name, description: this.post.description, content: this.post.content, image:this.post.imagePath})
            console.log(this.form)
          });
        }else{
          this.postId = null
        }
      })
    }

    onImagePicked(event: Event){
      const file = (event.target as HTMLInputElement).files;
      this.form.patchValue({"image": file![0]})
      this.form.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      }
      reader.readAsDataURL(this.form.value.image)
    }

    savePost(){
      if(this.form.invalid) return;

      this.isLoading = true
      if(this.postId){
        this.isLoading = false
        const postUpdate: Post = {
          id:this.postId,
          name: this.form.value.name,
          description: this.form.value.description,
          content: this.form.value.content,
          imagePath: this.form.value.image,
          creator: ""
        }
        this.postService.updatePost(postUpdate);
      }else{
        this.isLoading = false
        this.postService.addPost(this.form.value.name, this.form.value.description, this.form.value.content,this.form.value.image);
      }
      this.form.reset();
      // this.postCreated.emit(post);
    }

    ngOnDestroy(): void {
        this.authSub.unsubscribe();
    }

}
