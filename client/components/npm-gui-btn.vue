<style scoped rel="stylesheet/css">
  .button {
    border: 0;
    border-radius: 2px;
    color: #fff;
    font-family: inherit;
    font-size: 11px;
    font-weight: 500;
    outline: none;
    padding: 8px;
    text-transform: uppercase;
    transition: background-color 200ms;
  }

  .button:first-child { margin-left: 0; }
  .button:last-child { margin-right: 0; }

  .button:hover { filter: brightness(90%); }
  .button:active { filter: brightness(80%); }

  .button:disabled {
    cursor: disabled;
    filter: grayscale(100%);
  }

  .primary { background-color: #325d88; }
  .dark { background-color: #3e3f3a; }
  .warning { background-color: #ef5c0e; }
  .danger { background-color: #d9534f; }
  .success { background-color: #79a736; }
  .info { background-color: #1b8dbb; }

  .small {
    font-size: 9.5px;
    padding: 6px;
  }

  .oi {
    font-size: inherit;
    margin-right: 3px;
  }
</style>

<template>
  <button
    class="button"
    v-on:click="onClick"
    type="button"
  >
    <span></span>
    <span v-if="icon" class="oi" :data-glyph="icon"></span>
    <slot></slot>
  </button>
</template>

 <script lang="babel" type="text/babel">
 export default {
   props: ['icon', 'route'],
   methods: {
     onClick: function wtf(event) {
       if (this.route) {
         this.$root._router.replace(this.route); // eslint-disable-line
       } else {
         this.$emit('click', event);
       }
     },
   },
 };
</script>
