<template>
  <div :class="{'has-logo': showLogo, 'is-collapse': isCollapse}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
    <transition name="text-fade">
      <div v-if="!isCollapse" id="textContainer" :style="textContainerStyle">
        © 2023 NOVA-QA团队 <br> All rights reserved.
      </div>
    </transition>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      textContainerStyle: {}
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      return meta.activeMenu || path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    isCollapse: 'adjustTextContainerStyle'
  },
  mounted() {
    this.adjustTextContainerStyle() // Adjust the text container style initially
  },
  methods: {
    adjustTextContainerStyle() {
      if (this.isCollapse) {
        this.textContainerStyle = {
          position: 'absolute',
          left: 'calc(50% + 50px)', // Adjust this value based on your preference
          bottom: '10px',
          transform: 'translateX(-50%)',
          whiteSpace: 'normal'
        }
      } else {
        this.textContainerStyle = {
          position: 'fixed',
          left: '10px',
          bottom: '10px',
          whiteSpace: 'nowrap'
        }
      }
    }
  }
}
</script>

<style>
  #textContainer {
    font-size: 12px;
    color: white;
    text-shadow: 0 0 2px black;
    z-index: 9999;
  }
.text-fade-enter-active,
.text-fade-leave-active {
  transition: opacity 0.3s;
}
.text-fade-enter, .text-fade-leave-to {
  opacity: 0;
}
</style>
