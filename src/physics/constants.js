export const G =6.67430e-11; //ثابت الجاذبية 


export const EARTH_MASS = 5.972e24; // كتلة الكرة الارضية بال kg

export const EARTH_RADIUS = 6.371e6; // نصف قطر الكرة الارضية بالمتر

export const VISUAL_SCALE=1e5; //     "عامل قياس بصري" ها الرقم هو رقم لنحول بين القياسات يعني قطر الارض مثلا مش طبيعي نطبقو مقل ما هو على وحدات الشاشة  فنحن منعين واحدة منقييس عاساسها


export const EARTH_VISUAL_RADIUS = EARTH_RADIUS / VISUAL_SCALE;
//نصف قطر الارض بواحدة ال three js 