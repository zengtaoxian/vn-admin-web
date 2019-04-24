<template>
  <div>
    <p :title="title" v-html="title"></p>
  </div>

</template>
<script>
  export default {
    name: "default",
    props: {
      title: String
    }
  }
</script>
