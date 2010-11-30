/**
 * Copyright (C) 2009 eXo Platform SAS.
 * 
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

import org.exoplatform.webui.core.model.SelectItemOption ;
import org.exoplatform.webui.core.model.SelectItemCategory ;
import java.util.List;
import java.util.ArrayList;

  List options = new ArrayList() ;
  
  SelectItemCategory itemDefault  = new SelectItemCategory("Default");
  itemDefault.addSelectItemOption(new SelectItemOption("Page template",
                                  "system:/groovy/portal/webui/page/UIPage.gtmpl",
                                  "Description", "Default", true));  
  options.add(itemDefault);
  
  SelectItemCategory webosItem = new SelectItemCategory("WebOS");
  webosItem.addSelectItemOption(new SelectItemOption("Page template", "system:/groovy/portal/webui/page/UIDesktopPage.gtmpl",
                                "Description", "WebOS", true));
                                
  options.add(webosItem);
  
return options;
