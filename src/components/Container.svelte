<div id="pokedex">
    <div class="panel">
        <div class="content">
            <slot name="left"/>
        </div>
    </div>
    <div id="divider">
         <div class="gap"/>
         <div class="hinge"/>
         <div class="gap"/>
         <div class="hinge"/>
         <div class="gap"/>
         <div class="hinge"/>
         <div class="gap" />
    </div>
    <div class="panel">
        <!-- <div class="angles">
            <div class="inside-corner" />
            <div class="middle-corner" />
            <div class="inner-middle-corner" />
            <div class="outside-corner"/>
        </div> -->

        <div class="content">
            <div class="cap">
                <div class="outer-cap"/>
                <div class="middle-cap"/>
                <div class="inner-cap"/>
                <div class="inner-spacing"/>
                <div class="rounded-cap" />
            </div>
            <slot name="right"/>
        </div>
    </div>
</div>

<style>
    #pokedex { 
        background-color: #e61515;
        width: 848px;
        margin: 0 auto;
        padding: 1em;
        padding-top: 20px;
        border-radius: 15px;
        border: double black 10px;
        display: flex;
        height: 500px;
        margin-top: 200px;
        position: relative;
        flex-shrink: 0;
    }

    #divider { 
        display: flex;
        flex-direction: column;
        width: 30px;
        margin: 0 20px;
        align-items: center;
        border: inset #460f0f 4px;
        border-radius: 4px;
        background: #460f0f;
    }

    #divider > * {
        border-radius: 4px;
        border: solid #2d0d0d 2px;
    }

    .gap {    
         background: linear-gradient(90deg, #460f0f 0, #891313 30%, #b31818 45%, #fd5555 65%, #b31818 95%);
        border-top-color: #891313 !important;
        border-right-color: #b31818 !important;
        flex: 1;
        width: 95%;
    }

    .gap:first-child { 
        border-radius: 0 0 5px 5px;
        border-top: none;
    }

    .gap:last-child {
        border-radius: 5px 5px 0 0;
    }

    .hinge { 
        background: linear-gradient(90deg, #891313 0, #b31818 30%, #e61515 45%, #fd5555 65%, #e61515 95%);
        border-right-color: #fd5555 !important;
        border-top-color: #fd5555 !important;
        flex: 10;
        width: 100%;
        border-left-color: #5f1010 !important;
    }

    .panel { 
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        margin-top: 1em;
        padding: 10px;
        display: flex;
        flex-direction: column;
    }

    .outer-cap { 
        height: 31%;
        position: absolute;
        left: calc(50% + 15px);
        right: -10px;
        bottom: 99%;
        clip-path: polygon(0% 0%, 30% 0%, 60% 50%, 97% 50%, 100% 62%, 100% 100%, 0% 100%);
        background: black;
    }

    .middle-cap{ 
        background-color: #e61515;
        height: 31%;
        position: absolute;
        left: calc(50% + 15px);
        right: -7px;
        bottom: 98.5%;
        clip-path: polygon(0% 0%, 30% 0%, 60% 50%, 99% 50%, 100% 55%, 100% 100%, 0% 100%);
    }

    .inner-cap{ 
        height: 31%;
        position: absolute;
        left: calc(50% + 15px);
        right: -3.5px;
        bottom: 97.8%;
        clip-path: polygon(0% 0%, 30% 0%, 60% 50%, 100% 50%, 100% 100%, 0% 100%);
        background: black;
    }

    .inner-spacing {
        background-color: #e61515;
        height: 31%;
        position: absolute;
        left: calc(50% + 15px);
        right: 0px;
        bottom: 97.2%;
        clip-path: polygon(0% 0%, 30% 0%, 60% 50%, 100% 50%, 100% 100%, 0% 100%);
        background-color: #e61515;
    }

    .rounded-cap { 
        background-color: #e61515;
        border: double black 10px;
        border-bottom: none;
        border-left: none;
        border-radius: 15px;
        height: 30px;
        width: 80px;
        position: absolute;
        right: -10px;
        clip-path:polygon( 30% 0%, 100% 0, 100% 70%);
        top: -78px;

    }


    .content { 
        border: inset #b31818 3px;
        border-radius: 3px;
        height: 100%;
    }
</style>