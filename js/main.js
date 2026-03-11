// 回到顶部按钮
window.addEventListener('load', function() {
  // 创建回到顶部按钮
  const backToTop = document.createElement('button');
  backToTop.innerText = '↑';
  backToTop.className = 'back-to-top';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: #000;
    color: #fff;
    cursor: pointer;
    display: none;
    font-size: 18px;
  `;
  document.body.appendChild(backToTop);

  // 滚动显示/隐藏按钮
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });

  // 点击回到顶部
  backToTop.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});