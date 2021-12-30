<template>
  <div style="border: 2px solid #000000">
    <div style="height: 100%; overflow: auto">
      <textarea hidden name="" id="daily_editor" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>

<script>
import Uditor from '../src/uditor';

export default {
  name: 'app',
  data() {
    return {};
  },
  methods: {},
  mounted() {
    let d = new Uditor({
      holderId: 'daily_editor'
    });
  }
};
</script>

<style>
@import '../src/style/editor.css';
</style>
