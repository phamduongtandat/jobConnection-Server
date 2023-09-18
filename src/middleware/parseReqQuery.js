const parseReqQuery = () => (req, res, next) => {
  let {
    word,
    field,
    fields,
    page = 1,
    pageSize = 10,
    sort,
    searchBy,
    keyword,
    ...filter
  } = req.query;



  let parsedFilter = handleQueryList(filter);
  let filterStr = JSON.stringify(parsedFilter);
  filterStr = filterStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const filterObject = JSON.parse(filterStr);

  const { skip, limit } = calculateSkipAndLimit(page, pageSize);

  let query = {
    word,
    field,
    fields:
      typeof fields === 'string' ? fields.split(',').join(' ') : undefined,
    skip,
    limit,
    sort: typeof sort === 'string' || Array.isArray(sort) ? sort : '',
    page,
    pageSize,
    filter: {
      ...filterObject,
      ...handleSearch(searchBy, keyword),
    },
  };

  query.filter;

  req.query = query;
  next();
};

const calculateSkipAndLimit = (p, pSize) => {
  let page = Number(p);
  let pageSize = Number(pSize);

  if (isNaN(page)) {
    page = 1;
  }

  if (isNaN(pageSize)) {
    pageSize = 10;
  }

  return { skip: pageSize * (page - 1), limit: pageSize };
};

function handleSearch(searchBy, keyword) {
  if (!searchBy || !keyword) return {};
  if (typeof keyword !== 'string') return {};

  if (typeof searchBy === 'string' && !searchBy.includes(',')) {
    return {
      [searchBy]: {
        $regex: keyword,
        $options: 'i',
      },
    };
  }

  if (typeof searchBy === 'string' && searchBy.includes(',')) {
    searchBy = searchBy.split(',');
  }

  if (!Array.isArray(searchBy)) return {};

  const matchArr = searchBy.map((key) => {
    return {
      [key]: {
        $regex: keyword,
        $options: 'i',
      },
    };
  });

  return {
    $or: matchArr,
  };
}

function handleQueryList(filter) {
  const keys = Object.keys(filter);

  keys.forEach((key) => {
    if (typeof filter[key] === 'string' && filter[key].includes(',')) {
      filter[key] = { $in: filter[key].split(',') };
    }
  });

  return filter;
}

export default parseReqQuery;
