const { autorun, extendObservable, computed, act, toJS } = require('mobx');
const { ApolloClient, createNetworkInterface } = require('apollo-client');
const { query } = require('mobx-apollo');
const gql = require('graphql-tag');
global.fetch = require('node-fetch');

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj7c7kt9m08oe0198x4sk8zgy',
    dataIdFromObject: o => o.id
  })
});

const allPosts = gql`
  {
    allPosts {
      id
      title
    }
  }
`;

const singlePost = gql`
  query post($id: ID!) {
    Post(id: $id) {
      id
      title
    }
  }
`;

class PostsStore {
  constructor() {
    extendObservable(this, { postId: 'cj7c8rb0x1ndu01842w34gxby' });
    extendObservable(this, {
      get postNames() {
        const posts = this.allPosts.data || [];
        try {
          return posts.map(p => p.title);
        } catch (e) {
          console.log('Error getting post titles:', e.message);
          return [];
        }
      }
    });

    query(this, 'allPosts', {
      client,
      query: allPosts
    });

    query(this, 'currentPost', {
      client,
      query: singlePost,
      variables: this.currentPostVariables
    });
  }

  get currentPostVariables() {
    return {
      id: this.postId
    };
  }

  setCurrentPost(postId) {
    this.postId = postId;
  }
}

const postStore = new PostsStore();
autorun(() => console.log('all posts:', toJS(postStore.allPosts.data)));
autorun(() => console.log('current post', toJS(postStore.currentPost.data)));
autorun(() => console.log('post names', postStore.postNames));
