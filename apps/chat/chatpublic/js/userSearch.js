$("#userSearchForm").submit(function() { 
    var user = $(".user-search").val();
    if(user!=''){
    window.location.href='/user-search?search='+user
    }
    return false;
  });