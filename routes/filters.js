'use strict';
var etherUnits = require(__lib + "etherUnits.js")
var BigNumber = require('bignumber.js');
/*
  Filter an array of TX 
*/
function filterTX(txs, value) {
  var blockTX = txs.map(function(block) {
    var cleanTX = block.transactions.filter(function(obj) {
      return (obj.to==value || obj.from==value);   
    });
    return cleanTX.map(function(tx) { 
      var ttx = tx;
      ttx.timestamp = block.timestamp; 
      return ttx;
    });
  });
  return [].concat.apply([], blockTX);
}

function filterBlock(block, field, value) {
  var tx = block.transactions.filter(function(obj) {
    return obj[field]==value;   
  });
  tx = tx[0];
  if (typeof tx !== "undefined")
    tx.timestamp = block.timestamp; 
  return tx;
}

/* extract transactions from blocks */
function extractTX(blocks) {
    
  var blockTX = blocks.map(function(block) {
    return block.transactions.map(function(tx) { 
      var ttx = tx;
      ttx.value = etherUnits.toEther(new BigNumber(tx.value), 'wei');
      ttx.timestamp = block.timestamp; 
      return ttx;
    });
  });
  return [].concat.apply([], blockTX);
}

/* make blocks human readable */
function filterBlocks(blocks) {
  return blocks.map(function(block) {
    var b = block;
    b.extraData = hex2ascii(block.extraData);
    return b;
  })
}

/* stupid datatable format */
function datatableTX(txs) {
  return txs.map(function(tx){
    return [tx.hash, tx.blockNumber, tx.from, tx.to, 
            etherUnits.toEther(new BigNumber(tx.value), 'wei'), tx.gas, tx.timestamp]
  })
}

var hex2ascii = function (hexIn) {
    var hex = hexIn.toString();
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

module.exports = {
  extractTX: extractTX,
  filterBlock: filterBlock,
  filterBlocks: filterBlocks,
  filterTX: filterTX,
  datatableTX: datatableTX
}