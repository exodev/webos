var uiDockbar = {

  curve : 3,

  weight : 2.3,

  dockbarIconSize : 40,

  dockbarBackgroundHeight : 47,

  showDesktop : false,

  superClass : eXo.webui.UIPopupMenu,

  init : function()
  {
    var dockbar = $("#UIDockBar");

    dockbar.find("img.Icon").each(function(index)
    {
      var icon = $(this);

      icon.mouseover(function()
      {
        webuiExt.UIRightClickPopupMenu.hideContextMenu("DockbarContextMenu");
        var tooltip = icon.next();
        var x = eXo.core.Browser.findPosXInContainer(icon[0], dockbar[0]);
        tooltip.css({"display" : "block", "top" : -tooltip[0].offsetHeight, "left" : x});
      });

      icon.mouseout(function()
      {
        icon.next().css("display", "none");
      });

      icon.mousemove(function(e)
      {
        _module.UIDockbar.animateDockbar(e, dockbar, index);
      });
    });

    $("#PortletsViewer").toggle(
      function()
      {
        _module.UIDockbar.showApplications($(this));
      },
      function()
      {
        _module.UIDockbar.hideApplications($(this));
      }
    );

    setTimeout(function() {dockbar.css("visibility", "visible")}, 50);
    
    dockbar.on("mouseover", _module.UIDockbar.startDockBarEvt);
    
    var closeDockBar = dockbar.find(".UIRightClickPopupMenu .MenuItem a.CloseDockBarIcon"); 
    closeDockBar.attr("href", "javascript:require('SHARED/webos').UIDesktop.removeApp('" + closeDockBar.attr("href") + "')");
    closeDockBar.on("click", webuiExt.UIRightClickPopupMenu.prepareObjectIdEvt);
    
    dockbar.find(".UIRightClickPopupMenu .MenuItem a.QuitDockBarIcon").on("click", function(event)
    {
    	_module.UIDesktop.removeWindowContent(event, this);
    });
  },

  startDockBarEvt : function(evt)
  {
    document.oncontextmenu = document.body.oncontextmenu = function() {return false};
    var uiPageDesktop = document.getElementById("UIPageDesktop");
    uiPageDesktop.onmouseover = _module.UIDockbar.endDockBarEvt;
    return false;
  },

  endDockBarEvt : function()
  {
    this.onmouseover = null;
    document.oncontextmenu = document.body.oncontextmenu = function() {return true};
    webuiExt.UIRightClickPopupMenu.hideContextMenu("DockbarContextMenu");
    _module.UIDockbar.reset();
  },

  showApplications : function(icon)
  {
    $("#UIPageDesktop").find("div.UIWindow").each(function()
    {
      var appWindow = $(this);
      if(this.isShowed)
      {
        appWindow.css("display", "block");
      }
    });

    var imageURL = "/eXoResources/skin/sharedImages/Icon80x80/Hide" + icon.attr("id") + ".png";
    icon.attr("src", imageURL);
  },

  hideApplications : function(icon)
  {
    $("#UIPageDesktop").find("div.UIWindow").each(function()
    {
      var appWindow = $(this);
      if(this.isShowed)
      {
        appWindow.css("display", "none");
      }
    });

    var imageURL = "/eXoResources/skin/sharedImages/Icon80x80/Show" + icon.attr("id") + ".png";
    icon.attr("src", imageURL);
  },

  /**
   * Animate the icons in dockbar as user moves mouse over it.
   *
   * @param e
   * @param dockbar
   */
  animateDockbar : function(e, dockbar, targetIndex)
  {
    var C = _module.UIDockbar.curve;
    var W = _module.UIDockbar.weight;
    var iconH = _module.UIDockbar.dockbarIconSize;

    var isRT = eXo.core.I18n.isRT();
    var iconWidth = e.target.offsetWidth;
    var iconCenterX = _module.UIDesktop.findPosXInDesktop(e.target, isRT) + iconWidth / 2;

    dockbar.find("#FixBug").css("height", iconH * W);
    dockbar.find("#DockbarCenter").css("height", _module.UIDockbar.dockbarBackgroundHeight + iconH * (W -1));

    var desktopPage = $("#UIPageDesktop");
    //Mouse's horizontal coordinate relative to desktop page
    var mouseX = isRT ? (desktopPage[0].offsetWidth + desktopPage.offset().left - e.pageX) : (e.pageX - desktopPage.offset().left);
    var distanceWeight = (iconCenterX - mouseX) / (C * iconWidth);

    dockbar.find("img.Icon").each(function(index)
    {
      var deltaCurve = Math.abs(targetIndex - index);
      var size = iconH;
      if (deltaCurve < C)
      {
        if (index == targetIndex)
        {
          size = Math.round(iconH + iconH * (W - 1) * ((C - deltaCurve) / C - Math.abs(distanceWeight)));
          distanceWeight = -distanceWeight;
        }
        else
        {
          size = Math.round(iconH + iconH * (W - 1) * ((C - deltaCurve) / C + distanceWeight));
        }

        $(this).css({"width" : size, "height" : size});
      }
    });

    _module.UIDockbar.resizeDockBar();
  },

  removeDockbarIcon : function(iconId)
  {
    var icon = $("#" + iconId);
    if (icon.length > 0)
    {
      var prev = icon.prev();
      if (prev[0].nodeType == 3)
      {
        prev.remove();
      }
      icon.remove();
      //Remove tooltip
      icon.next("span").remove();
    }
  },

  reset : function()
  {
    $("#DockbarCenter").css("height", _module.UIDockbar.dockbarBackgroundHeight);

    var iconSize = _module.UIDockbar.dockbarIconSize;
    $("#IconContainer").children("img.Icon").css({"width" : iconSize, "height" : iconSize});
    $("#FixBug").css("height", iconSize);

    _module.UIDockbar.resizeDockBar();
  },

  resizeDockBar : function()
  {
    var desktopPage = $("#UIPageDesktop")[0];
    var dockbar = $("#UIDockBar")[0];
    var iconContainer = $("#IconContainer");

    var widthItemControl = 0;
    iconContainer.children("img.Icon").each(function()
    {
      widthItemControl += Math.max(this.offsetWidth, _module.UIDockbar.dockbarIconSize) + 5;
    });

    var totalWidthSeparators = 0;
    iconContainer.children("img.Separator").each(function()
    {
      totalWidthSeparators += this.offsetWidth + 10;
    });

    iconContainer.css("width", (widthItemControl + totalWidthSeparators + 10) + "px");

    if (!dockbar.totalPadding)
    {
      var totalPadding = 0;
      iconContainer.parentsUntil(dockbar.parentNode).each(function()
      {
        var p = $(this);
        var rp = parseInt(p.css("paddingRight"));
        var lp = parseInt(p.css("paddingLeft"));
        if (!isNaN(rp))
        {
          totalPadding += rp;
        }
        if (!isNaN(lp))
        {
          totalPadding += lp;
        }
      });

      dockbar.totalPadding = totalPadding;
    }

    dockbar.style.width = (iconContainer[0].offsetWidth + dockbar.totalPadding) + "px";
    dockbar.style.left = ((desktopPage.offsetWidth - dockbar.offsetWidth) / 2) + "px";
  }
}
_module.UIDockbar = uiDockbar;
