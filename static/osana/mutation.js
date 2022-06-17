new MutationObserver((mutationList, observer) => {
  for(const mutation of mutationList) {
    mutation.addedNodes.forEach(node => _$rewriteElement(node));
    _$rewriteElement(mutation.target);
  }
}).observe(document, {
  childList: true,
  subtree: true
});
