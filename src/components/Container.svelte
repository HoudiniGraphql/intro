<div id="pokedex">
    <div id="left-panel" class="panel">
        <slot name="left" />
    </div>
    <div id="middle-panel" class="panel">
        <div id="divider">
            <div class="gap"/>
            <div class="hinge"/>
            <div class="gap"/>
            <div class="hinge"/>
            <div class="gap"/>
            <div class="hinge"/>
            <div class="gap" />
        </div>
    </div>
    <div id="right-panel" class="panel">
        
        <slot name="right" />
    </div>
    <div>
        <div id="cap" />
        <div id="border-spacing"/>
        <div id="outer-line" />
        <div id="inner-border" />
        <div id="top-left-corner" class="corner" />
        <div id="top-right-corner" class="corner" />
        <div id="bottom-right-corner" class="corner" />
        <div id="middle-corner" class="corner" />
        <div id="bottom-left-corner" class="corner" />
    </div>
</div>

<style>

    #pokedex { 
        display: flex;
        flex-direction: row;
        height: 600px;
        width: 50%;
        max-width: 848px;
        align-items: flex-end;
        margin: 0 auto;
        margin-top: 100px;
        position: relative;
    }

    #left-panel, #divider, #right-panel { 
        background-color: var(--pokedex-red);
    }

    #divider { 
        height: calc(90% + 2px);
        display: flex;
        flex-direction: column;
        align-items: center;
        border: inset #460f0f 4px;
        background: #460f0f;
        border-top-width: 3px;
    }
    
    #left-panel { 
        width: 10px;
        flex-grow:  1;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        padding: 1em;
        box-sizing: border-box;
    }

    #right-panel { 
        width: 10px;
        height: 80%;
        flex-grow: 1;
        padding: 1em;
        box-sizing: border-box;
        margin-top: -30px;
        border-bottom-right-radius: 5px;
    }

    #right-panel *:not(#cap) {
        z-index: 10;
    }

    #left-panel, #middle-panel { 
        height: 100%;
    }

    #middle-panel { 
        width: 30px;
        background-color: var(--pokedex-red);
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        border-top-right-radius: 10px;
    }

    .panel { 
        z-index: 10;
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
    
    #cap { 
        height: calc(21% + 2px);
        position: absolute;
        left: calc(50% + 15px);
        right: 0px;
        bottom: 70%;
        clip-path: polygon(0% 1px, calc(30% + 2px) 1%, calc(60% - 2px) calc(49.8% + 1px ), 97% calc(49.8% + 1px ), 100% 62%, 100% 100%, 0% 100%);
        background: var(--pokedex-red);
        z-index: 5;
    }

    #outer-line { 
        position: absolute;
        background: black;
        left: -10px;
        right: -10px;
        top: -10px;
        bottom: -10px;
        clip-path: polygon(
            /* top of left panel */    
            3% 0%, calc(50% + 25px) 0%, 49% 0%, calc(50.1% + 24px) 3%, calc(50.1% + 24px) calc(10% - 9px), 
            /* right panel */        
            calc(65% + 10px) calc(10% - 9px), 80% calc(19% - 1px), 97% calc(19% - 1px), 100% 24%, 
            /* bottom line */
            100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%
        );
    }
    
    #border-spacing { 
        position: absolute;
        background: var(--pokedex-red);
        left: -7px;
        right: -7px;
        top: -7px;
        bottom: -7px;
        clip-path: polygon(
            /* top of left panel */    
            calc(3% - 4px) 0%, calc(50% + 22px) 0%, calc(50% + 10px) 0%, calc(50.1% + 21px) calc(2%), calc(50.1% + 21px) calc(10% - 8px),  calc(50.2% + 22px) calc(10% - 8px), 
            /* right panel */        
            calc(65% + 10px) calc(10% - 8px), calc(80% + 1px) calc(19% + 0px), calc(97% + 2px) calc(19%), calc(100.1% - 1px) calc(24% - 3px), 
            /* bottom line */
            100% calc(97% + 3px), calc(97% + 3px) 100%, calc(3% - 3px) 100%, 0% calc(97% + 3px), 0% calc(3% - 3px)
        );
        z-index: 2;
    }
    
    #inner-border { 
        position: absolute;
        background: black;
        left: -4px;
        right: -3px;
        top: -4px;
        bottom: -3px;
        clip-path: polygon(
            /* top of left panel */    
            calc(3% - 3px) 1px, calc(50% + 19px) 1px, calc(50% + 19px) calc(10% - 7px), 
            /* right panel */        
            calc(65% + 12px) calc(10% - 7px), calc(80% + 2px) calc(19% + 2px), calc(97% + 2px) calc(19% + 2px), 100% calc(24% - 3px), 
            /* bottom line */
            100% calc(97% + 3px), calc(97% + 3px) 100%, calc(3% - 3px) 100%, 1px calc(97% + 3px), 1px calc(3% - 3px)
        );
        z-index: 3;
    }
   
    #top-left-corner { 
        top: -10px;
        left: -10px;
        clip-path: polygon(0 0, 50% 0, 50% 50%, 0 50%)
    }
    
    #top-right-corner { 
        top: calc(17.9% - 1px);
        right: -10px;
        clip-path: polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)
    }

    #bottom-right-corner { 
        bottom: -10px;
        right: -10px;
        clip-path: polygon(100% 50%, 100% 100%, 50% 100%, 50% 50%)
    }
    
    #middle-corner { 
        top: -10px;
        right: calc(50% - 25px);
        clip-path: polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)
    }

    #bottom-left-corner { 
        bottom: -10px;
        left: -10px;
        clip-path: polygon(0% 50%, 50% 50%, 50% 100%, 0% 100%)
    }

    .corner { 
        background-color: var(--pokedex-red);
        border: 10px double black;
        height: 50px;
        width: 50px;
        border-radius: 15px;

        position: absolute;
        z-index: 5;
    }
</style>