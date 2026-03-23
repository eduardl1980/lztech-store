-- ============================================================
-- LZ Tech Store — Migración inicial a Supabase
-- Fecha: 2026-03-23
-- Instrucciones: Pegar en Supabase → SQL Editor → Run
-- ============================================================


-- ============================================================
-- PASO A: Crear tablas
-- ============================================================

create table if not exists products (
  id text primary key,
  name text,
  description text,
  price numeric,
  stock integer,
  category text,
  images text[],
  "createdAt" timestamptz default now()
);

create table if not exists orders (
  id text primary key,
  customer jsonb,
  items jsonb,
  total numeric,
  status text default 'pending',
  "createdAt" timestamptz default now(),
  "updatedAt" timestamptz
);

create table if not exists config (
  id integer primary key default 1,
  "storeName" text,
  tagline text,
  whatsapp text,
  description text,
  "adminPassword" text
);


-- ============================================================
-- PASO B: Insertar productos (31 productos)
-- ============================================================

insert into products (id, name, description, price, stock, category, images) values
('p1', 'Camara IP WiFi 360', 'Seguridad inalambrica, vision nocturna, 1080p Full HD.', 28900, 18, 'Seguridad', array['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop']),
('p2', 'Camara Deportiva 4K', 'Resistente al agua 30m. Carcasa y soportes incluidos.', 45900, 11, 'Camaras', array['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop']),
('p3', 'Botella Termica 750ml', 'Acero inoxidable doble pared. Frio 24hs, caliente 12hs.', 12500, 38, 'Hogar', array['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop']),
('p4', 'Ventilador LED Escritorio', 'USB con luces RGB. 3 velocidades, silencioso.', 8900, 33, 'Hogar', array['https://images.unsplash.com/photo-1586953208270-767889fa9b0f?w=400&h=400&fit=crop']),
('p5', 'Auriculares Bluetooth TWS', 'True Wireless, cancelacion de ruido, 6hs autonomia.', 15900, 27, 'Audio', array['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop']),
('p6', 'Parlante Bluetooth', '10W, IPX7, bateria 12hs.', 19500, 20, 'Audio', array['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop']),
('p7', 'Powerbank 20000mAh', 'Carga rapida USB-C PD 22.5W. Display LED.', 22000, 30, 'Energia', array['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop']),
('p8', 'Cargador Solar Plegable', '21W, 2 puertos USB. Ideal camping.', 35000, 7, 'Energia', array['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=400&fit=crop']),
('p9', 'Ring Light 10 Pulgadas', 'Tripode, soporte celular. 3 tonos, 10 niveles.', 16500, 20, 'Iluminacion', array['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop']),
('p10', 'Tira LED RGB 5m', 'Control remoto y WiFi. 16M colores, sync musica.', 11900, 45, 'Iluminacion', array['https://images.unsplash.com/photo-1550535424-b498819c7572?w=400&h=400&fit=crop']),
('p11', 'Mouse Gamer 12000 DPI', '7 botones, peso ajustable, cable mallado.', 13500, 25, 'Perifericos', array['https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop']),
('p12', 'Teclado Mecanico 60%', 'Switches Blue, RGB, keycaps PBT, USB-C.', 32000, 10, 'Perifericos', array['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop']),
('p13', 'Soporte Notebook Aluminio', 'Ergonomico, ventilado, plegable, 260g.', 18900, 20, 'Accesorios', array['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop']),
('p14', 'Hub USB-C 7 en 1', 'HDMI 4K, USB 3.0, SD, PD 100W, Ethernet.', 24500, 16, 'Accesorios', array['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop']),
('p15', 'Smartwatch Deportivo', 'AMOLED, GPS, SpO2, 100+ deportes, 14 dias.', 38900, 14, 'Wearables', array['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop']),
('p16', 'Mini Drone con Camara', 'Plegable, 720p, giroscopio, 15 min vuelo.', 42000, 5, 'Drones', array['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=400&fit=crop']),
('p17', 'Webcam Full HD 1080p', 'Gran angular, autofoco, mic estereo, USB.', 14900, 22, 'Camaras', array['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=400&fit=crop']),
('p18', 'Lampara Escritorio LED', 'Articulada, 5 temps, 5 brillos, USB.', 16000, 16, 'Iluminacion', array['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop']),
('p19', 'Kit Cable Management', '120 piezas: clips, velcro, espiral. 3M.', 6500, 49, 'Accesorios', array['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop']),
('p20', 'Purificador Aire USB', 'HEPA H13, 99.97%, 25dB, luz nocturna.', 21000, 11, 'Hogar', array['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop']),
('mn36s6tzjx9j6', 'Smartwatch Mujer Rosa', 'Reloj inteligente con monitoreo de salud, frecuencia cardiaca, ciclo menstrual y notificaciones. Resistente al agua IP67. Bateria 7 dias.', 45000, 20, 'Smartwatches', array['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600','https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600','https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600']),
('mn36s6tz0oefr', 'Auriculares Bluetooth Rosa', 'Auriculares inalambricos con cancelacion de ruido activa, 30hs de bateria y estuche de carga compacto. Sonido premium.', 32000, 15, 'Audio', array['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600','https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600','https://images.unsplash.com/photo-1491927570842-0261e477d937?w=600']),
('mn36s6tzqm0oe', 'Secador de Pelo Ionico Pro', 'Secador profesional 2200W, tecnologia ionica anti-frizz, 3 temperaturas, difusor y concentrador incluidos.', 28000, 12, 'Belleza Tech', array['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600','https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=600']),
('mn36s6tz6euiz', 'Luz LED Selfie Ring', 'Aro de luz LED de 26cm con tripode ajustable hasta 1.8m. 3 tonos de luz, 10 niveles de brillo. Ideal para streaming y fotos.', 18500, 30, 'Fotografia', array['https://images.unsplash.com/photo-1615655096345-61a54750068d?w=600','https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600','https://images.unsplash.com/photo-1452802447250-470a88ac82bc?w=600']),
('mn36s6tzlscsu', 'Parlante Portatil Waterproof', 'Parlante bluetooth 20W resistente al agua IPX7. Luces RGB, 24hs de autonomia, microfono integrado para llamadas.', 22000, 25, 'Audio', array['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600','https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600']),
('mn37epzp3rs0l', 'Mouse Inalambrico Silencioso', 'Mouse ergonomico inalambrico 2.4GHz, 3200 DPI ajustable, click silencioso, bateria recargable USB-C, hasta 60 dias de uso.', 18900, 25, 'Perifericos', array['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600','https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600','https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600']),
('mn37epzp5umjm', 'Monitor LED 24 Full HD', 'Monitor LED 24 pulgadas Full HD 1080p, 75Hz, panel IPS, tiempo de respuesta 5ms, HDMI y VGA incluidos, ajuste de altura.', 89000, 8, 'Monitores', array['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600','https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600','https://images.unsplash.com/photo-1547119957-637f8679db1e?w=600']),
('mn37ypvhqgm6y', 'Cargador Inalambrico 15W', 'Cargador inalambrico rapido Qi 15W compatible con iPhone y Android. Base de carga compacta con indicador LED y proteccion de temperatura.', 8900, 40, 'Accesorios', array['https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600','https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600','https://images.unsplash.com/photo-1583394293214-0b3b67b7b248?w=600']),
('mn37ypvh38jsy', 'Powerbank 20000mAh', 'Bateria portatil 20000mAh con carga rapida 22.5W, 3 salidas USB + USB-C, pantalla LCD con porcentaje de carga, peso 450g.', 22500, 22, 'Accesorios', array['https://images.unsplash.com/photo-1609592806596-4f4308a7b8ff?w=600','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600','https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600']),
('mn37ypvhnpflv', 'Camara Web Full HD', 'Camara web 1080p 30fps con microfono estereo integrado, autofocus, compatible con Zoom, Teams y Meet. Plug and play USB.', 15900, 17, 'Camaras', array['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600','https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?w=600','https://images.unsplash.com/photo-1623949556303-b0d17e99db23?w=600']),
('mn37ypvhkitjb', 'Soporte Notebook Aluminio', 'Soporte ergonomico de aluminio para notebook de 10 a 16 pulgadas. Angulo ajustable, plegable, mejora la postura y ventilacion.', 12500, 30, 'Accesorios', array['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600','https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600','https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600']);


-- ============================================================
-- PASO C: Insertar órdenes (7 órdenes)
-- ============================================================

insert into orders (id, customer, items, total, status, "createdAt", "updatedAt") values
(
  'mn3ciymnfkvlj',
  '{"name":"ariel Lozada","phone":"1211212","payment":"Efectivo","delivery":"Retiro en el comercio","address":"","notes":"nada"}',
  '[{"id":"p16","name":"Mini Drone con Camara","qty":1,"price":42000,"subtotal":42000}]',
  42000, 'delivered', '2026-03-23T15:34:02.447Z', '2026-03-23T15:35:06.197Z'
),
(
  'mn3aafvnrigwx',
  '{"name":"Maria Paz","phone":"121411212","payment":"Efectivo","delivery":"Envio a domicilio","address":"Avellaneda 2110","notes":"Rejas verdes, puerta negra"}',
  '[{"id":"p2","name":"Camara Deportiva 4K","qty":1,"price":45900,"subtotal":45900},{"id":"p4","name":"Ventilador LED Escritorio","qty":1,"price":8900,"subtotal":8900},{"id":"p8","name":"Cargador Solar Plegable","qty":1,"price":35000,"subtotal":35000},{"id":"p14","name":"Hub USB-C 7 en 1","qty":1,"price":24500,"subtotal":24500},{"id":"p20","name":"Purificador Aire USB","qty":1,"price":21000,"subtotal":21000}]',
  135300, 'delivered', '2026-03-23T14:31:25.667Z', '2026-03-23T14:33:29.319Z'
),
(
  'mn39vxemi3men',
  '{"name":"Lucia","phone":"120012112","payment":"Efectivo","delivery":"Retiro en el comercio","address":"","notes":"voy a retirrlo yo!"}',
  '[{"id":"p6","name":"Parlante Bluetooth","qty":1,"price":19500,"subtotal":19500},{"id":"p4","name":"Ventilador LED Escritorio","qty":1,"price":8900,"subtotal":8900},{"id":"p8","name":"Cargador Solar Plegable","qty":1,"price":35000,"subtotal":35000}]',
  63400, 'paid', '2026-03-23T14:20:08.542Z', '2026-03-23T14:22:04.227Z'
),
(
  'mn3964r544j9x',
  '{"name":"JOse Lopez","phone":"1212121212121","payment":"Efectivo","delivery":"Retiro en el comercio","address":"","notes":"Lo paso a buscar a uktima hora"}',
  '[{"id":"p14","name":"Hub USB-C 7 en 1","qty":1,"price":24500,"subtotal":24500},{"id":"p19","name":"Kit Cable Management","qty":1,"price":6500,"subtotal":6500},{"id":"p12","name":"Teclado Mecanico 60%","qty":2,"price":32000,"subtotal":64000}]',
  95000, 'delivered', '2026-03-23T14:00:05.009Z', '2026-03-23T14:22:13.319Z'
),
(
  'mn35x10is9jie',
  '{"name":"Jose","phone":"12345678","payment":"Efectivo","delivery":"Retiro en el comercio","address":"","notes":"Voy a las 20hs directo al local"}',
  '[{"id":"p3","name":"Botella Termica 750ml","qty":2,"price":12500,"subtotal":25000},{"id":"p6","name":"Parlante Bluetooth","qty":1,"price":19500,"subtotal":19500},{"id":"p8","name":"Cargador Solar Plegable","qty":1,"price":35000,"subtotal":35000}]',
  79500, 'pending', '2026-03-23T12:29:01.411Z', null
),
(
  'mn2byqhivcv9j',
  '{"name":"bgg","phone":"112211221","payment":"Efectivo","delivery":"Retiro en el comercio","address":"","notes":"ggg"}',
  '[{"id":"p12","name":"Teclado Mecanico 60%","qty":3,"price":32000,"subtotal":96000},{"id":"p16","name":"Mini Drone con Camara","qty":2,"price":42000,"subtotal":84000}]',
  180000, 'pending', '2026-03-22T22:30:32.598Z', null
),
(
  'mn2bv03zh0rr8',
  '{"name":"jose","phone":"11111","payment":"Efectivo","delivery":"Retiro en el comercio","address":"","notes":"afasf"}',
  '[{"id":"p5","name":"Auriculares Bluetooth TWS","qty":1,"price":15900,"subtotal":15900}]',
  15900, 'pending', '2026-03-22T22:27:38.447Z', null
);


-- ============================================================
-- PASO D: Insertar configuración de la tienda
-- ============================================================

insert into config (id, "storeName", tagline, whatsapp, description, "adminPassword") values
(1, 'LZ Tech', 'Innovacion Digital', '5491169959675', 'Tecnologia, accesorios y gadgets al mejor precio. Envios a todo el pais.', 'admin123');


-- ============================================================
-- VERIFICACIÓN — Ejecutar para confirmar que todo se cargó bien
-- ============================================================

select 'products' as tabla, count(*) as registros from products
union all
select 'orders', count(*) from orders
union all
select 'config', count(*) from config;
