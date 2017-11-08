const { autorun, extendObservable, act, toJS } = require('mobx');
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
autorun(() => console.log(toJS(postStore.allPosts.data)));
autorun(() => console.log(toJS(postStore.currentPost.data)));
