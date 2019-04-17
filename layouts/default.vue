<template>
  <div>
    <TheHeader 
      @sidenavToggle="sidenavToggle"/>
    <TheSidenav 
      :show="displaySidenav" 
      @close="hideSidenav"/>
    <nuxt />
  </div>
</template>

<script>
  import TheHeader from '@/components/Navigation/TheHeader';
  import TheSidenav from '@/components/Navigation/TheSidenav';

  export default {
    name: 'DefaultLayout',
    middleware: 'log',
    components: {
      TheHeader,
      TheSidenav
    },
    data() {
      return {
        displaySidenav: false
      }
    },
    methods: {
      sidenavToggle() {
        this.displaySidenav = !this.displaySidenav;
      },
      hideSidenav() {
        this.displaySidenav = false;
      }
    }
  }
</script>

<style>
  html {
    font-family: 'Open Sans', sans-serif;
  }
  body {
    margin: 0;
  }
</style>
