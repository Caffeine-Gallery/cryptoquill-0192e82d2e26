import { backend } from 'declarations/backend';

let quill;

document.addEventListener('DOMContentLoaded', async () => {
  quill = new Quill('#editor', {
    theme: 'snow'
  });

  const newPostBtn = document.getElementById('newPostBtn');
  const newPostForm = document.getElementById('newPostForm');
  const submitPostBtn = document.getElementById('submitPost');

  newPostBtn.addEventListener('click', () => {
    newPostForm.classList.toggle('hidden');
  });

  submitPostBtn.addEventListener('click', submitPost);

  await fetchAndDisplayPosts();
});

async function fetchAndDisplayPosts() {
  const posts = await backend.getPosts();
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';

  posts.sort((a, b) => b.timestamp - a.timestamp);

  posts.forEach(post => {
    const postElement = document.createElement('article');
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p class="author">By ${post.author}</p>
      <div class="content">${post.body}</div>
      <p class="timestamp">${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</p>
    `;
    postsContainer.appendChild(postElement);
  });
}

async function submitPost() {
  const title = document.getElementById('postTitle').value;
  const author = document.getElementById('postAuthor').value;
  const body = quill.root.innerHTML;

  if (!title || !author || !body) {
    alert('Please fill in all fields');
    return;
  }

  try {
    await backend.addPost(title, body, author);
    document.getElementById('postTitle').value = '';
    document.getElementById('postAuthor').value = '';
    quill.setContents([]);
    document.getElementById('newPostForm').classList.add('hidden');
    await fetchAndDisplayPosts();
  } catch (error) {
    console.error('Error submitting post:', error);
    alert('An error occurred while submitting the post. Please try again.');
  }
}
