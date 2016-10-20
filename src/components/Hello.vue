<template>
  <div class="hello">
    <h1>{{ msg }}</h1><!-- 大家有沒有看到跟ng一樣的寫法， 這行render出來換變成 => <h1> Welcome to Your Vue.js App </h1>-->
	  <input type="text" v-model="msg"/><!-- vue跟ng1&ng2一樣，也充滿了語法糖，v-model，是要做到雙向綁定的意思，就是修改的同時，msg變數也會修改，那上面的這行字也會跟著修改，這就是雙向綁定神奇的地方啊 -->
	  <br>
	  <a v-bind:href="href">google</a><!-- 又是個語法糖，也可以簡化為:href，作用是用來綁定屬性，也可以藉由綁定屬性，component可以藉由prop取得資料或物件 -->
	  <!-- 這裡render完會變成 => <a href="www.google.com">google</a> ，也有人會寫<a href="{{href}}">google</a>這樣是也可以運作的，只是會有少部份情況會出現不是你希望看到的畫面，或是效果，待各位自行研究了-->
	  <br>
	  <button v-on:click="onHandleClick">+1</button><!-- 又是個語法糖，也可以簡化為@click，作用是用來綁定事件 -->
	  <span v-text="count"></span><!-- 如果客戶非常龜毛，跟你反應頁面剛開起來會看到一堆{{adf}}之類的亂碼，可以透過這個語法糖，讓vue啟動之後再把變數render出來 -->
	  <h2 v-if="count>0">Hello Component</h2><!-- 如果不符合條件，tag將會被刪除，不是隱藏喔，隱藏要用v-show -->
    <br>
	  <select v-model="selector">
		  <option v-for="(val,index) in [1,2,3]" :value="index" v-text="val"></option>
		  <!-- 今天講我們最後一個要說的語法糖v-for，類似foreach的效果，是在show陣列或物件資料不可或缺的存在 -->
		  <!-- render完會變成如下
		  <option value="0">1</option>
		  <option value="1">2</option>
		  <option value="2">3</option>
		  -->
	  </select>
    <h1>{{ storeCount }}</h1>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      href: 'http://www.google.com',
      count: 0
    }
  },
  methods: {
    onHandleClick () {
      this.count++
    }
  },
  computed: {
    storeCount () {
      return this.$store.state.count
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
