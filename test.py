# Counting vehicles that entered in exit zone.
#         Purpose of this class based on detected object and local cache create
#         objects pathes and count that entered in exit zone defined by exit masks.
#         exit_masks - list of the exit masks.
#         path_size - max number of points in a path.
#         max_dst - max distance between two points.
def __init__(self, exit_masks=[], path_size=10, max_dst=30, x_weight=1.0, y_weight=1.0):
  super(VehicleCounter, self).__init__()

  self.exit_masks = exit_masks

  self.vehicle_count = 0
  self.path_size = path_size
  self.pathes = []
  self.max_dst = max_dst
  self.x_weight = x_weight
  self.y_weight = y_weight

def check_exit(self, point):
  for exit_mask in self.exit_masks:
      try:
          if exit_mask[point[1]][point[0]] == 255:
              return True
      except:
          return True
  return False

def __call__(self, context):
  objects = context['objects']
  context['exit_masks'] = self.exit_masks
  context['pathes'] = self.pathes
  context['vehicle_count'] = self.vehicle_count
  if not objects:
      return context

  points = np.array(objects)[:, 0:2]
  points = points.tolist()

  # add new points if pathes is empty
  if not self.pathes:
      for match in points:
          self.pathes.append([match])

  else:
      # link new points with old pathes based on minimum distance between
      # points
      new_pathes = []

      for path in self.pathes:
          _min = 999999
          _match = None
          for p in points:
              if len(path) == 1:
                  # distance from last point to current
                  d = utils.distance(p[0], path[-1][0])
              else:
                  # based on 2 prev points predict next point and calculate
                  # distance from predicted next point to current
                  xn = 2 * path[-1][0][0] - path[-2][0][0]
                  yn = 2 * path[-1][0][1] - path[-2][0][1]
                  d = utils.distance(
                      p[0], (xn, yn),
                      x_weight=self.x_weight,
                      y_weight=self.y_weight
                  )

              if d < _min:
                  _min = d
                  _match = p

          if _match and _min <= self.max_dst:
              points.remove(_match)
              path.append(_match)
              new_pathes.append(path)

          # do not drop path if current frame has no matches
          if _match is None:
              new_pathes.append(path)

      self.pathes = new_pathes

      # add new pathes
      if len(points):
          for p in points:
              # do not add points that already should be counted
              if self.check_exit(p[1]):
                  continue
              self.pathes.append([p])

  # save only last N points in path
  for i, _ in enumerate(self.pathes):
      self.pathes[i] = self.pathes[i][self.path_size * -1:]

  # count vehicles and drop counted pathes:
  new_pathes = []
  for i, path in enumerate(self.pathes):
      d = path[-2:]

      if (
          # need at list two points to count
          len(d) >= 2 and
          # prev point not in exit zone
          not self.check_exit(d[0][1]) and
          # current point in exit zone
          self.check_exit(d[1][1]) and
          # path len is bigger then min
          self.path_size <= len(path)
      ):
          self.vehicle_count += 1
      else:
          # prevent linking with path that already in exit zone
          add = True
          for p in path:
              if self.check_exit(p[1]):
                  add = False
                  break
          if add:
              new_pathes.append(path)

  self.pathes = new_pathes

  context['pathes'] = self.pathes
  context['objects'] = objects
  context['vehicle_count'] = self.vehicle_count

  self.log.debug('#VEHICLES FOUND: %s' % self.vehicle_count)

  return context