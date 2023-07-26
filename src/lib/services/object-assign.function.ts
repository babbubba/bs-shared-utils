export function objectAssign<T>(targetObject: T, source: any) {
  for (const [key, value] of Object.entries(source)) {
    let fieldName = '';
    if(key.indexOf("-") > 0) {
      fieldName = key.replace("-",".");
    }
    else {
      fieldName = key;
    }
    const t = typeof (value);
    if (t === 'string') {
      // eval(taget + '.' + key + " = '" + value + "'");
      eval('targetObject' + '.' + fieldName + " = '" + value + "'");
    } else if (value && Array.isArray(value)) {
      if (value.length <= 0) {
        // eval(taget + '.' + key + ' = []');
        eval('targetObject' + '.' + fieldName + ' = []');
      }
      else {
        // eval(taget + '.' + key + ' = ' + value);
        eval('targetObject' + '.' + fieldName + ' = ' + value);
      }
    }
    else {
      // eval(taget + '.' + key + ' = ' + value);
      eval('targetObject' + '.' + fieldName + ' = ' + value);
    }
  }
}
