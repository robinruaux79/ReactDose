import { useCallback, Children, isValidElement, cloneElement, useRef } from "react";
import uniqid from 'uniqid';

const useRefs = () => {
  const refs = useRef({});

  const register = useCallback((refname) => ref => {
    refs.current[refname] = ref;
  }, []);

  return [refs, register];
}

export { useRefs };

const formatHtml = (text) => {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

export { formatHtml };

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
export { clamp };


const recursiveMap = (children, fn) => {
  return Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = cloneElement(child, {
        children: recursiveMap(child.props.children, fn)
      });
    }

    return fn(child, index);
  });
}
export { recursiveMap };