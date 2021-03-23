document.addEventListener('DOMContentLoaded', function() {
    
    //load();
    // console.log(profile_id);
    document.querySelector('#post-button').addEventListener('click', post);
    //document.querySelector('#edit-button').addEventListener('click', showEdit());
    document.addEventListener('click', event => {
        
        
        const element = event.target;
        const post = element.parentElement;
        const original = post.innerHTML;

        if (element.className === `edit-post-${post.id}`) {  
       // load(); 
            post.innerHTML=`<textarea id="textarea-${post.id}"></textarea> <button id = "submit" style="display: inline" class="submit_edit_${post.id}"> Submit Edit</button>`;
            const post_id = post.id;
            const submit = document.querySelector('#submit');
            const text = document.querySelector(`#textarea-${post.id}`);
            submit.disabled = true;
            text.onkeyup = () => {
                if (text.value.length > 0) {
                    submit.disabled = false;
                } else {
                    submit.disabled = true;
                }
   
            }
             
            document.addEventListener('click', event => {
                const element = event.target;
                const button = document.querySelector('button')
                if (element.className === `submit_edit_${post.id}`) {
                    const post_id = post.id;
                    const post_value = document.querySelector(`#textarea-${post.id}`).value;
                    console.log(`${post_value}`);
                    
                    edit(post_id);
                    post.innerHTML = post_value;
                        
                }
                if (element.id == 'edit') {
                    post.innerHTML = original;
                }
                
                
                 
            });
            
        
        }
          
            
    });
                //document.querySelector('#submit_edit').addEventListener('click', edit(post_id))

    if (document.querySelector('#profile_id') != null) {
        const profile_id= document.querySelector('#profile_id').value;
        document.querySelector('#follow').addEventListener('click', () => follow(profile_id));
    }
    

    // document.querySelector('#all_posts').addEventListener('click', () => load('all_posts'));
    

});

// function showEdit(post) {
//     // close open edit spaces
//     // open edit space
    
//     post.innerHTML =`<textarea id="textarea-${post.id}"></textarea> <button id = "submit" style="display: inline" class="submit_edit_${post.id}"> Submit Edit</button>`;

// }

function edit(post_id) {
    const text = document.querySelector(`#textarea-${post_id}`).value;

    fetch(`edit/${post_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            text: text
            
        })
      });
      //load();
      
}

function load() {
    fetch("")
    .then(response => response.json())
    .then(data => {
        // posts.forEach(function(value, index) {
        //     const element = document.createElement('div');
        //     const post_id = posts[index].id;
        //     element.innerHTML = `${posts[index].text}`;
        data.posts.forEach(add_post);
        }

        )
        
        
    }



function post() {
       var text = document.getElementById('new_post').value;
         fetch('post', {
            method: 'POST',
            body: JSON.stringify({
                text: text
            })
        })    
        .then(response => response.json())
        .then(result => {
        // Print result
        //add_post(result);
    });
   // add_post(text)
    
}


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
    console.log(profile_id);
    const profile = document.querySelector('#profile_user').value;
    const follow = `/follow/${profile_id}`;
    fetch(follow, {
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
document.querySelector('#follow').innerHTML = `Unfollow`;
}



// function like() {

// }



{% extends "network/layout.html" %}
{% load static %}

{% block body %}


    <!-- <textarea id="new_post" name="new_post"></textarea> -->
    <input type="text" id="new_post" name="new_post">
    <button id="post-button">Post</button>


{% for post in page_obj %}
    <div id="{{ post.id }}">
        <a  href="{% url 'profile' post.author_id %}">{{ post.author }}</a>: {{ post.text }}
        {% if post.author == request.user %}
        <button id="edit" style="display: inline" class="edit-post-{{ post.id }}" data-post="{{ post.id }}"> Edit Post</button>
        {% endif %}
    </div>
{% endfor %}

<div class="pagination">
    <span class="step-links">

    {% if page_obj.has_previous %}
    <a class="btn btn-outline-info mb-4" href="?page=1">First</a>
    <a class="btn btn-outline-info mb-4" href="?page={{ page_obj.previous_page_number }}">Previous</a>
    {% endif %}
    
    {% if page_obj.has_next %}
            <a class="btn btn-outline-info mb-4" href="?page={{ page_obj.next_page_number }}">next</a>
            <a class="btn btn-outline-info mb-4" href="?page={{ page_obj.paginator.num_pages }}">last</a>
    {% endif %}
</span>

</div>

<div id="posts">
    
</div>
{% endblock %}

{% block script %}
<script src="{% static 'network/index.js' %}"></script>
{% endblock %}