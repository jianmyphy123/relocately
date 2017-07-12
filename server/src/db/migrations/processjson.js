'use strict';

module.exports = {

  process: function (orig_data){
    for(var i=0;i<orig_data.length;i++){

      //handle type
      if(orig_data[i].type=="Furniture"){ orig_data[i].type = 1;}
      if(orig_data[i].type=="Packaging"){ orig_data[i].type = 2;}
      if(orig_data[i].type=="Special Item"){ orig_data[i].type = 3;}

      //handle name
      orig_data[i].name={en:orig_data[i].name_en,de:orig_data[i].name_de}
      delete orig_data[i].name_en;
      delete orig_data[i].name_de;

      //handle dimensions
      if( typeof orig_data[i].length == 'string'){orig_data[i].length =parseFloat(orig_data[i].length.replace(',',''));}
      if( typeof orig_data[i].depth == 'string'){orig_data[i].depth =parseFloat(orig_data[i].depth.replace(',',''));}
      if( typeof orig_data[i].width == 'string'){orig_data[i].width =parseFloat(orig_data[i].width.replace(',',''));}

      //handle dismantling_factor
      orig_data[i].dismantling_factor=parseInt(orig_data[i].dismantling_factor,10)/100;

      //  handle weight
      if( typeof orig_data[i].weight == 'string'){orig_data[i].weight =parseFloat(orig_data[i].weight.replace(',',''));}

      //handle replacement_value
      if( typeof orig_data[i].replacement_value == 'string'){orig_data[i].replacement_value =parseFloat(orig_data[i].replacement_value.replace(',',''));}

      //handle dismantling
      if(orig_data[i].dismantling=="No"){ orig_data[i].dismantling = 1;}
      if(orig_data[i].dismantling=="Yes - Relocately"){ orig_data[i].dismantling = 2;}
      if(orig_data[i].dismantling=="Yes - Customer"){ orig_data[i].dismantling = 3;}
      if(orig_data[i].dismantling=="Yes - Client"){ orig_data[i].dismantling = 3;}

      //handle packed_by
      if(orig_data[i].packed_by=="No"){ orig_data[i].packed_by = 1;}
      if(orig_data[i].packed_by=="Yes - Relocately"){ orig_data[i].packed_by = 2;}
      if(orig_data[i].packed_by=="Yes"){ orig_data[i].packed_by = 2;}
      if(orig_data[i].packed_by=="Yes - Customer"){ orig_data[i].packed_by = 3;}
      if(orig_data[i].packed_by=="Yes - Client"){ orig_data[i].packed_by = 3;}

      //handle unpacked
      if(orig_data[i].unpacked=="No"){ orig_data[i].unpacked = 1;}
      if(orig_data[i].unpacked=="Yes - Relocately"){ orig_data[i].unpacked = 2;}
      if(orig_data[i].unpacked=="Yes"){ orig_data[i].unpacked = 2;}
      if(orig_data[i].unpacked=="Yes - Customer"){ orig_data[i].unpacked = 3;}
      if(orig_data[i].unpacked=="Yes - Client"){ orig_data[i].unpacked = 3;}

      //handle assembling
      if(orig_data[i].assembling=="No"){ orig_data[i].assembling = 1;}
      if(orig_data[i].assembling=="Yes - Relocately"){ orig_data[i].assembling = 2;}
      if(orig_data[i].assembling=="Yes - Customer"){ orig_data[i].assembling = 3;}
      if(orig_data[i].assembling=="Yes - Client"){ orig_data[i].assembling = 3;}

      //handle one_man_handling
      if(orig_data[i].one_man_handling=="No"){ orig_data[i].one_man_handling = false;}
      if(orig_data[i].one_man_handling=="Yes"){ orig_data[i].one_man_handling = true;}

      //handle cratecrate
      if(orig_data[i].crate=="No"){ orig_data[i].crate = 1;}
      if(orig_data[i].crate=="Yes - Relocately"){ orig_data[i].crate = 2;}
      if(orig_data[i].crate=="Yes"){ orig_data[i].crate = 2;}



    }
     return orig_data;
  }
}




