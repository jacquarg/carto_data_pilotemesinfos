'use-strict'

///////////////////////////////////////////////////////////
// libs


const PLD = {}


PLD.getItem = (item, allItems) => {
  // TODO : clean this !

  let attrs = {}
  if (typeof item === 'string') { // it's an id !
    attrs = allItems[item]
  } else {
    attrs = allItems[item['@id']]
  }

  return new MetaObject(attrs)
  // return attrs
}

PLD.isType = (item, type) => {
  if (!(item && item['@type'])) { return false }

  const typeProp = item['@type']
  return  typeProp === type || (typeProp instanceof Array && typeProp.indexOf(type) !== -1)
}

PLD.mapOnObject = (objects, fun) => {
  if (objects instanceof Array) {
    return objects.map(fun)
  }
  return fun(objects)
}

PLD.testOnObject = (objects, test) => {
  if (objects && objects instanceof Array) {
    return objects.some(test);
  } else {
    return test(objects);
  }

}

PLD.forEachOnTreeOfPredicates = (fun , item, props, allItems) => {
  item = PLD.getItem(item, allItems)
  fun(item)
  props.forEach((prop) => {
    if (item[prop]) {
      item[prop] = PLD.mapOnObject(item[prop], (value) => PLD.forEachOnTreeOfPredicates(fun, value, props, allItems))
    }
  })

  return item
}

PLD.fillTreeForPredicates = (item, props, allItems) => {
  PLD.forEachOnTreeOfPredicates(() => undefined, item, props, allItems)
  return item
}
//   item = PLD.getItem(item, allItems)
//   props.forEach((prop) => {
//     if (item[prop]) {
//       item[prop] = PLD.mapOnObject(item[prop], (value) => PLD.fillTreeForProps(value, props, allItems))
//     }
//   })
//
//   return item
// }


const U = {}

U.groupBy = (list, key) => {
  return list.reduce((res, item) => {
    if (!(item[key] in res)) {
      res[item[key]] = []
    }
    res[item[key]].push(item)
    return res
  }, {})
}

///////////////////////////////////////////////////////////

const typologiesColors = {
  // label:
  "Déplacement":
  //   color:
    {r: 0x3F, g: 0xA8, b: 0x7B},

  // label:
  "Domicile" :
   // color:
  {r: 0xB7, g: 0xDB, b: 0x6C},
  //
  // label:
  "Finance":
  // color:
  {r: 0x75, g: 0xCB, b: 0x82},
  //
  // label:
  "Communication":
  // color:
  {r: 0x9B, g: 0xDB, b: 0x6C},
  //
  // label:
  "Profil":
  // color:
  {r: 0x59, g: 0xB3, b: 0x60},
  //
  // label:
  "Loisir":  // color:
  {r: 0x2C, g: 0x85, b: 0x6D},

}

// prototype for metaobject deserialized from json-ld read-only data.
class MetaObject {
  constructor(attrs) {
    $.extend(this, attrs)
  }

  serializeData() {
    const data = $.extend({}, this)
    data.id = data['@id']
    data.typologyColor = typologiesColors[data.typology]

    const flatPropTree = (item, prefix = '') => {
      return item.allProperties
      .map(prop => PLD.getItem(prop, M.items)).reduce((res, prop) => {
        if (PLD.isType(prop, 'object')) {
          return res.concat(flatPropTree(prop, `${prefix}${prop.propName}/`))
        }

        if (PLD.isType(prop, 'array')) {
          return res.concat(flatPropTree(PLD.getItem(prop.items, M.items), `${prefix}${prop.propName}/`))
        }

        res.push({
          propName: `${prefix}${prop.propName}`,
          description: prop.description,
          exampleValue: prop.exampleValue,
          kind: prop.kind,
          id: prop['@id']
        })

        return res
      }, [])
    }

    let props = flatPropTree(this)

    data.mainProperties = props.filter(prop => prop.kind !== 'Metadata')
    data.secondaryProperties = props.filter(prop => prop.kind === 'Metadata')

    return data
  }

  get allProperties () {
    let props = []
    if (this.hasProperty) {
      PLD.mapOnObject(this.hasProperty, (prop) => props.push(prop))
    }

    if (this.hasOptionalProperty) {
      PLD.mapOnObject(this.hasOptionalProperty, (prop) => props.push(prop))
    }
    return props
  }
}


const M = {}

M.prepare = () => {
  return Promise.all([
    $.getJSON('http://mesinfos.fing.org/cartographies/wikiapi/items.json'),
    $.getJSON('http://mesinfos.fing.org/cartographies/wikiapi/indexes/mesinfos_datasets.json')
  ])
  .then((res) => {
    M.items = res[0]
    M.datasets = res[1]['schema:itemListElement']
      .map(item => PLD.fillTreeForPredicates(item, ['hasProperty', 'hasOptionalProperty', 'items'], M.items))
  })
}

M.attachEvents = () => {
  $('.toggle').click((ev) => {
    $(ev.currentTarget.parentElement)
    .toggleClass('compact')
    .toggleClass('expanded')
  })

  $('#word_filter').on('input', (ev) => {
    let q = $('#word_filter').val()
    let highlights = null
    if (!q) {
      highlights = M.datasets
    } else {
      q = q.toLowerCase()
      highlights = M.treeHighlight((item) => Object.values(item).some((value) => PLD.testOnObject(value,
        (v) => {
          if (typeof v !== "string") return false
          return v.toLowerCase().indexOf(q) !== -1
        }))
      )

    }
    $('.subject').toggleClass('active', false)
    highlights.forEach((id) =>  $(`[id='${id}']`).toggleClass('active', true))
  })
}

M.render = () => {
  const byTypology = U.groupBy(
    M.datasets.map((id) => PLD.getItem(id, M.items)).sort((a, b) => a.label < b.label ? -1 : 1 ), 'typology')

  let index = 0
  Object.keys(byTypology).sort().forEach((typology) => {
    const typologyElem = $(typologyTemplate({ typology }))
    $('#documentation').append(typologyElem)

    byTypology[typology].forEach((dataset) => {
      const data = dataset.serializeData()
      typologyElem.find('ul').append(doctypeTemplate(data))
    })
  })
  M.attachEvents()
  $('.name').textfill({ maxFontPixels: 30, });
}

// Return a set of item ids to highlight
M.treeHighlight = (q) => {
  const highlight = new Set()

  M.datasets.forEach((dataset) => {
    PLD.forEachOnTreeOfPredicates((item => {
      if (q(item)) {
        highlight.add(item['@id'])
      }
    }), dataset, ['items', 'hasProperty', 'hasOptionalProperty'], M.items)
  })

  return highlight
}


M.prepare()
.then(() => M.render())
