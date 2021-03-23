document.addEventListener('DOMContentLoaded', function() {
 
    //document.querySelector('#post-button').addEventListener('click', post);
    if (document.querySelector('#profile_id') != null) {
        const profile_id= document.querySelector('#profile_id').value;
        document.querySelector('#follow').addEventListener('click', () => follow(profile_id));
    }
    

});



function like_count(post_id) {

}

function showEdit(button) {
    //const post = button.previousElementSibling
    //post is original html
    
    const post = button.parentElement
    const post_og = post.innerHTML
    const post_id = post.parentElement.id
    console.log(post_id)
    post.innerHTML = `<textarea id="new_text_${post_id}"></textarea> <button class="submit">submit</button>`;
    //if click is not submitting post restore original html onclick="edit(${post_id})" 
    document.addEventListener('click', event => {
        const element = event.target;
        if (element.className === 'submit') {
            edit(post_id)
        } else if (element.id ===`edit-${post_id}`) {
            showEdit(button)
        } else if (element.id === `new_text_${post_id}`) {
            
        } else if (element.id !=`edit-${post_id}`) {
            new_text = document.querySelector(`#new_text_${post_id}`).value;
            if (new_text != null) {
                post.innerHTML = `<div class="text">${new_text}</div>`
                        
            }
            post.innerHTML = post_og
        
        }
    });   

}

function edit(post_id) {
    const new_text = document.querySelector(`#new_text_${post_id}`).value;
    fetch(`edit/${post_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            text: new_text
            
        })
      });
      var post = document.querySelector(`#new_text_${post_id}`).parentElement;
      
      post.innerHTML = `<div class="text">${new_text}</div> <button id="edit-${post_id}" class="edit" onclick="showEdit(this)">edit</button>`;
      //load(post_id)

      
}

function load(post_id) {
    var post = document.getElementById(`${post_id}`).innerHTML;

    // fetch(`load/${post_id}`)
    // .then(response => response.json())
    // .then(data => {
    //     const post = document.querySelector(`#${post_id}`);
    //     post.innerHTML = `${data.text} ${data.likes}`;
    //     console.log(data);
       
    //     });
        
    }



// function post() {
//        var text = document.getElementById('new_post').value;
//          fetch('post', {
//             method: 'POST',
//             body: JSON.stringify({
//                 text: text
//             })
//         })    
//         .then(response => response.json())
//         .then(result => {
//         // Print result
//         //add_post(result);
//     });
// //     load()
// //    add_post(text)
    
// }


function add_post(text) {
    const post= document.createElement('div');
    post.className = 'post';
    post.innerHTML = `<li>${text}</li>`;

    document.querySelector('#posts').append(post);
}

// function profile() {
//     // fetch('')
    
//     // .then(response => response.json())
//     // .then(data => {
//     //     // Log data to the console
//     //     console.log(data);
//     // });
// }

function follow(profile_id) {
   // const profile = document.querySelector('#profile_user').value;
   // const follow = `/follow/${profile_id}`;
    var follow = document.querySelector('#follow');
    let count = parseInt(document.querySelector('#follower_count').innerHTML);
    let following_count = parseInt(document.querySelector('#following_count').innerHTML);
    const profile = document.querySelector('#profile_id').value;
    const user = document.querySelector('#user_id').value;
    if (follow.innerHTML === 'unfollow') {
        follow.innerHTML = 'follow';
        count -= 1;
        document.querySelector('#follower_count').innerHTML = count;
        if (profile === user) {
            following_count -=1;
            document.querySelector('#following_count').innerHTML = following_count;
        }
    } else if (follow.innerHTML === 'follow') {
        follow.innerHTML= 'unfollow';
        count += 1;
        document.querySelector('#follower_count').innerHTML = count;
        if (profile === user) {
            following_count +=1;
            document.querySelector('#following_count').innerHTML = following_count;
        }
    }
    fetch(`/follow/${profile_id}`, {
        method: 'POST',
        body: JSON.stringify({
            followee: profile_id
            
        })
    })    
    .then(response => response.json())
    .then(result => {
    // Print result
    console.log(result);
});
//fix follow button text

}


function like(element) {
    // update like status
    post_id = element.parentElement.id
    const user = document.querySelector('#user').value;
    var likebutton = document.querySelector(`#like-${post_id}`).innerHTML;

    if (element.className === 'like') {
        let like_count = parseInt(document.querySelector(`#like-count-${post_id}`).innerHTML);
        if (element.innerHTML === 'like') {
            like_count += 1;
            document.querySelector(`#like-count-${post_id}`).innerHTML = like_count;
            element.innerHTML = 'unlike';
        } else if (element.innerHTML === 'unlike') {
            like_count -= 1;
            document.querySelector(`#like-count-${post_id}`).innerHTML = like_count;
            element.innerHTML = 'like';
        }
        
        
    }
    fetch(`like/${post_id}`, {
        method: 'POST',
        body: JSON.stringify({
            user: user,
            likes: post_id
        })
    })    
    .then(response => response.json())
    .then(result => {
    // Print result
    console.log(result);
});
    //change like button html 


    
}


