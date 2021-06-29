var pcp_div0 =   
            `<div class="hidden" id="dim-div"> 
                <br>
                <label>Dimension order: </label>
                <input type="text" id="dim-order" value="">
                <button id="reorder" type="submit">Reorder</button>
                <button id="add-pcp" type="submit"> + </button>

                <b id="qfd">&emsp;Total QFD:&nbsp;</b> 
                <b id="qfd_value"> - </b>
                <b id="pcc">&emsp;Mean correlation:&nbsp;</b> 
                <b id="pcc_value"> - </b>
                <b id="polyline">&emsp;Mean polyline distance:&nbsp;</b> 
                <b id="polyline_value"> - </b>
                
              </div>
              <div class="grid" id="targetPC"></div>`

function generate_pcp_div(pcp_id){
    pcp_div =  `<div class="show" id="dim-div${pcp_id}"> 
                <br>
                <label>Dimension order: </label>
                <input class="dim-order" type="text" id="dim-order${pcp_id}" value="">
                <button class="reorder" id="reorder${pcp_id}" type="submit" onclick=reorder(event)>Reorder</button>
                <button id="add-pcp" type="submit"> + </button>

                <b id="qfd${pcp_id}">&emsp;Total QFD:&nbsp;</b> 
                <b id="qfd_value${pcp_id}"> - </b>
                <b id="pcc${pcp_id}">&emsp;Mean correlation:&nbsp;</b> 
                <b id="pcc_value${pcp_id}"> - </b>
                <b id="polyline${pcp_id}">&emsp;Mean polyline distance:&nbsp;</b> 
                <b id="polyline_value${pcp_id}"> - </b>
                
              </div>

              <div class="grid" id="targetPC${pcp_id}"></div>`

    return pcp_div;
}

function get_pcp_id(button_id){
    return button_id.replace(/[^0-9]/g,'');
}
