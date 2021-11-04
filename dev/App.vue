<template>
  <div style="border: 2px solid #000000">
    <div style="height: 100%; overflow: auto">
      <textarea hidden name="" id="daily_editor" cols="30" rows="10"></textarea>
    </div>
  </div>
</template>

<script>
import dailyEditor from '@/editor/daily-editor';

export default {
  name: 'app',
  data() {
    return {};
  },
  methods: {},
  mounted() {
    dailyEditor.start({
      tools: ['text', 'heading', 'list-unordered', 'double-quotes-l', 'table-2', 'code-view', 'flow-chart', 'link'],
      textareaId: 'daily_editor'
    });
  }
};
</script>

<style>
@import '../src/style/editor.css';
</style>
