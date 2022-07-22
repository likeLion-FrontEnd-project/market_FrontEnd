const accountName = localStorage.getItem('accountname');
const token = localStorage.getItem('token');
const feedMain = document.querySelector('.home-main');
const postCategory = document.querySelector('.post-category');
const postTit = document.querySelector('.post-title');
const modalBg = document.querySelector('.modal-bg');
const modalBottom = document.querySelector('.modal-window-bottom');
const modalCloseBar = document.querySelector('.modal-close-bar');
const modalReport = document.querySelector('#report');
const modalCenter = document.querySelector('.modal-window-center');
const modalCancelBtn = document.querySelector('#cancel-btn');
const modalReportBtn = document.querySelector('#report-btn');

// 피드 정보 불러오기
async function getFeedInfo () {
  const postFeedPath = '/post/feed/?limit=50&skip=0';
  const reqInfo = {
    method : 'GET',
    headers : {
      Authorization : `Bearer ${token}`,
      'Content-type' : 'application/json',
    },
  }
  const res = await fetch(url + postFeedPath, reqInfo)
                    .then((response) => {
                      return response;
                    })
  const json = await res.json();
  console.log('post 전송',json);

  // 포스트가 없으면 초기화면 , 있으면 팔로우 게시글 보여주기
  if(json.posts.length <= 0 ) {
    // 피드 초기화면
    const feedMainInit = document.createElement('div');
    const mainLogoImg = document.createElement('img');
    const mainText = document.createElement('p');
    const mainSearchLink = document.createElement('a');
    
    feedMainInit.setAttribute('class', 'home-main-initial');
    mainLogoImg.setAttribute('class', 'main-logo-image');
    mainLogoImg.setAttribute('src', '../assets/images/image-symbol-logo.png');
    mainText.setAttribute('class', 'main-text');
    mainSearchLink.setAttribute('class', 'main-search-link');
    mainSearchLink.setAttribute('href', '../pages/search-result.html');

    mainText.textContent = '유저를 검색해 팔로우 해보세요!';
    mainSearchLink.textContent = '검색하기'

    feedMain.append(feedMainInit);
    feedMainInit.append(mainLogoImg);
    feedMainInit.append(mainText);
    feedMainInit.append(mainSearchLink);
  } else {
    // 팔로우 목록의 피드 화면
    const postSection = document.createElement('section');
    const srOnly = document.createElement('h2');
    const postWrap = document.createElement('ul');

    postSection.setAttribute('class', 'post-section feed');
    srOnly.setAttribute('class', 'sr-only');
    postWrap.setAttribute('class', 'post-list-wrap feed');

    srOnly.textContent = '피드 게시물 부분';

    feedMain.append(postSection);
    postSection.append(srOnly);
    postSection.append(postWrap);

    for(let i = 0; i < json.posts.length; i++) {
      const POSTS = json.posts[i];
      const postId = POSTS.id;

      // 피드 리스트 목록
      const postList = document.createElement('li');
      const postNav = document.createElement('div');
      const postUser = document.createElement('div');
      const userInfo = document.createElement('div');

      postList.setAttribute('class', 'post-list-item');
      postNav.setAttribute('class', 'post-nav');
      postUser.setAttribute('class', 'post-user');
      userInfo.setAttribute('class', 'user-info');

      postWrap.append(postList);
      postList.append(postNav);
      postNav.append(postUser);
      postUser.append(userInfo);
      
      // 피드 이미지
      const postImgWrap = document.createElement('ul');
      const postImgList = document.createElement('li');
      const imgUrl = POSTS.image;

      postImgWrap.setAttribute('class', 'post-img-wrap');
      postImgList.setAttribute('class', 'post-img-list');

      postList.prepend(postImgWrap);
      postImgWrap.append(postImgList)

      if(imgUrl.split(',').length >= 1 && imgUrl.split(',')[0] !== '') {
        imgUrl.split(',').map((src) => {
        const postImg = document.createElement('img');
        postImg.setAttribute('class', 'post-image');
        postImg.src = src;
        postImgList.append(postImg);        
      })
      } else {
        postImgWrap.remove(postImgList)
      } 

      // 피드 프로필계정 & 프로필이미지 & 더보기 버튼
      const userImage = document.createElement('img');
      const userName = document.createElement('strong');
      const account = document.createElement('span');
      const postMenuBtn = document.createElement('button');
      const menuBtnImg = document.createElement('img');

      userImage.setAttribute('class', 'profile-image');
      userImage.setAttribute('src', POSTS.author.image);
      userName.setAttribute('class', 'profile-name');
      account.setAttribute('class', 'profile-account');
      postMenuBtn.setAttribute('class', 'post-menu-button');
      menuBtnImg.setAttribute('class', 'post-menu-button-image');
      menuBtnImg.setAttribute('src', '../assets/images/icon/icon-post-menu.svg');
      
      postUser.prepend(userImage);
      userInfo.append(userName);
      userInfo.append(account);
      postMenuBtn.append(menuBtnImg);
      postNav.append(postMenuBtn);

      const accountName = POSTS.author.accountname;
      const username = POSTS.author.username;

      userName.textContent = username;
      account.textContent =  `@${accountName.slice(0, 9)}`;
      // console.log(accountName.slice(0, 6));
      
      // 프로필사진 클릭 시 해당 프로필 페이지로 이동
      userImage.addEventListener('click', () => {
        location.href = `/pages/feedDetail.html?accountname=${accountName}`;
      })

      // 피드 컨텐츠 내용
      const contentText = POSTS.content.split(',');
      const postMain = document.createElement('div');
      const postCategory = document.createElement('span');
      const postTitle = document.createElement('h3');
      const postContent = document.createElement('p');
      const postMoreBtn = document.createElement('button');

      postMain.setAttribute('class', 'post-main');
      postCategory.setAttribute('class', 'post-category');
      postTitle.setAttribute('class', 'post-title');
      postContent.setAttribute('class', 'post-content');
      postMoreBtn.setAttribute('class', 'detail-button');
      
      postList.append(postMain);
      postMain.append(postCategory);
      postMain.append(postTitle);
      postMain.append(postContent);
      postContent.append(postMoreBtn);

      if(contentText.length >= 3 && contentText[0] === '오늘의 잡담' || contentText[0] === '찬반대결' || contentText[0] === '오늘의 팁') {
        // 카테고리, 타이틀 추가 (카테고리명이 일치할 경우에만)
        postCategory.textContent = contentText[0];
        postTitle.textContent = contentText[1];
        postContent.textContent = contentText[2];
      }
      else {
        postCategory.style.display = 'none';
        postTitle.style.display = 'none';
        postContent.textContent = contentText;
      }
    
      // 피드 하단 
      const postFooter = document.createElement('div');
      const postTime = document.createElement('p');
      const postFooterBtns = document.createElement('div');
      const likeBtn = document.createElement('button');
      const likeNum = document.createElement('span');
      const commentBtn = document.createElement('button');
      const commentNum = document.createElement('span');

      postFooter.setAttribute('class', 'post-footer');
      postList.append(postFooter);

    // 피드 하단 - 찬성 or 반대
    if(contentText[0] === '찬반대결') {
      const clicked = 'clicked';

      // 카테고리가 '찬반 대결'인 경우 피드 하단 부분
      const thumUpBtn = document.createElement('button');
      const thumUpImg = document.createElement('img');
      const thumDownBtn = document.createElement('button');
      const thumDownImg = document.createElement('img');

      postFooter.setAttribute('class', 'post-footer thumbs-buttons');
      thumUpBtn.setAttribute('class', 'thumbs-up-button');
      thumUpImg.setAttribute('class', 'thumbs-up-image');
      thumDownBtn.setAttribute('class', 'thumbs-down-button');
      thumDownImg.setAttribute('class', 'thumbs-down-image');

      postFooter.append(thumUpBtn);
      postFooter.append(thumDownBtn);
      thumUpBtn.append(thumUpImg);
      thumDownBtn.append(thumDownImg);

      // 찬성 
      thumUpBtn.addEventListener('click', () => {
        thumDownBtn.classList.remove(clicked);
        thumUpBtn.classList.toggle(clicked);
        thumUpBtn.style.transition = '0.3s';
      })
      // 반대
      thumDownBtn.addEventListener('click', () => {
        thumUpBtn.classList.remove(clicked);
        thumDownBtn.classList.toggle(clicked);
        thumDownBtn.style.transition = '0.3s';
      })
    } else {
      // 피드 하단 기본(시간, 좋아요, 댓글)
      postTime.setAttribute('class', 'post-time');
      postFooterBtns.setAttribute('class', 'post-footer-button');
      likeBtn.setAttribute('class', 'like-button');
      likeBtn.setAttribute('type', 'button');
      likeNum.setAttribute('class', 'like-num');
      commentBtn.setAttribute('class', 'comment-button');
      commentBtn.setAttribute('type', 'button');
      commentNum.setAttribute('class', 'comment-num');

      postFooter.append(postTime);
      postFooter.append(postFooterBtns);
      postFooterBtns.append(likeBtn);
      postFooterBtns.append(likeNum);
      postFooterBtns.append(commentBtn);
      postFooterBtns.append(commentNum);

      const heartCount = POSTS.heartCount;
      const commentCount = POSTS.commentCount;
    
      likeNum.textContent = heartCount;
      commentNum.textContent = commentCount;

      // 업로드 시간
      const uploadDate = timeForToday(POSTS.createdAt);
      postTime.textContent = uploadDate;

      // 좋아요 
      async function likePost () {
        const likePath = `/post/${postId}/heart`;
        const reqInfo = {
          method : 'POST',
          headers : {
            Authorization : `Bearer ${token}`,
            'Content-type' : 'application/json',
          },
        }
        const res = await fetch(url + likePath, reqInfo)
                          .then((response) => {
                            return response;
                          })
        const json = await res.json();
        console.log(json);
      }

      async function cancelLikePost () {
        const likeCancelPath = `/post/${postId}/unheart`;
        const reqInfo = {
          method : 'DELETE',
          headers : {
            Authorization : `Bearer ${token}`,
            'Content-type' : 'application/json',
          },
        }
        const res = await fetch(url + likeCancelPath, reqInfo)
                          .then((response) => {
                            return response;
                          })
        const json = await res.json();
        console.log(json);
      }

      likeBtn.addEventListener('click', () => {
        async function handleLikeBtn () {
          let data = {};
          if(likeBtn.classList.contains('clicked')) {
            likeBtn.classList.remove('clicked');
            data = await cancelLikePost();
            likeNum.textContent = POSTS.heartCount;
          } else {
            likeBtn.classList.add('clicked');
            data = await likePost();
            likeNum.textContent = POSTS.heartCount;
          }
        }
        handleLikeBtn();
      })

      // 댓글창 연결
      commentBtn.addEventListener('click', () => {
        location.href = `/pages/postcomment.html?postId=${postId}`;
      })
    }

      // 게시글신고 하단 모달창
      postMenuBtn.addEventListener('click', () => {
        modalBg.classList.remove('hidden');
        modalBottom.classList.remove('hidden');

        modalCloseBar.addEventListener('click', () => {
          modalBottom.classList.add('hidden');
          modalBg.classList.add('hidden');
        })

        modalBg.addEventListener('click', () => {
          modalBottom.classList.add('hidden');
          modalBg.classList.add('hidden');
        })
      })

      // 게시글 신고 중앙 모달창
      modalReport.addEventListener('click', () => {
        modalCenter.classList.remove('hidden');
        modalBottom.classList.add('hidden');
        modalBg.addEventListener('click', () => {
          modalCenter.classList.add('hidden');
        })

        modalReportBtn.addEventListener('click', () => {
          modalCenter.classList.add('hidden');
          modalBg.classList.add('hidden');
        })

        modalCancelBtn.addEventListener('click', () => {
          modalCenter.classList.add('hidden');
          modalBg.classList.add('hidden');
        })
      })
    }
  }
} 
getFeedInfo();

// 피드 업로드 시간 확인하는 함수
function timeForToday(value) {
  const today = new Date();
  const timeValue = new Date(value);
  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return "방금 전";
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }
  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }
  
  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  } 
  return `${Math.floor(betweenTimeDay / 365)}년 전` + console.log(today);
}
