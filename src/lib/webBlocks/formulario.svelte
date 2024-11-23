<script>
    let {showForm} = $props()
</script>

<div id="form" style="display: {showForm === true ? 'flex': 'none'};">
    <form name="contact" method="POST" data-netlify="true">
        <p>
          <label>Your Name: <input type="text" name="name" /></label>
        </p>
    </form>
      
</div>

<style>
    #form {
        height: 100vh;
        width: 100vw !important;
        position: fixed;
        top: 0;
        width: 0;
        background-color: rgba(0,0,0,.3);
        backdrop-filter: blur(10px);
        align-items: center;
        justify-content: center
    }

    form {
        max-width: 920px;
        margin: 5px;
    }
</style>