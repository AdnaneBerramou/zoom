<template>
	<div id="index container">
		<home v-if="showHome"></home>
		<join-room v-if="showJoin"></join-room>
		<create-room v-if="showCreate"></create-room>
		<error-component v-if="showError" :msg="errorMsg"></error-component>
	</div>
</template>

<script>
import { bus } from '../main'
import Home from './Home'
import Join from './Join'
import Create from './Create'
import ErrorComponent from './Error'

export default {
	created() {
		bus.$on('switchComponent', componentName => {
			for (let i in this.$data) {
				if (i === 'show'+componentName) {
					this.$data[i] = true;
				} else {
					this.$data[i] = false;
				}
			}
		});

		bus.$on('error', msg => {
			this.errorMsg = msg;

			for (let i in this.$data) {
				this.$data[i] = false;
			}

			this.showError = true;
		});
	},

	data() {
		return {
			showHome: true,
			showJoin: false,
			showCreate: false,
			showError: false
		}
	},

	components: {
		home: Home,
		joinRoom: Join,
		createRoom: Create,
		errorComponent: ErrorComponent
	}
}
</script>

<style lang="scss">
</style>