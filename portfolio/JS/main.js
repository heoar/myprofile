$(function(){
  AOS.init({duration: 1500, offset: 0});

  /* 디자인팝업 */
  $(".cont3 .firstImg").click(function(){
    let popnum = $(this).index();
    console.log(popnum);

    $(".popWrap").addClass("on");
    $(".popWrap > .dsPop_11").addClass("on");
  })

  $(".cont3 .imglist > li").click(function(){
    let popnum = $(this).index();
    console.log(popnum);

    $(".popWrap").addClass("on");
    $(".popWrap > .dsPop_" + popnum).addClass("on");
  })

  $(".popWrap").click(function(){
    $(".popWrap").removeClass("on");
    $(".popWrap > .popArea").removeClass("on");
    $(".popWrap > .dsPop_11").removeClass("on");
  })

  /* 스와이퍼 */
  var swiper = new Swiper(".webSwiper", {
    slidesPerView: 3.2,
    spaceBetween: 20,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
  });
})