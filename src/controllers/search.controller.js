import searchService from "../services/search.service.js";


//       _____ FIELDS _____

const searchFields = async (req, res) => {
    const { name } = req.query
    const { code, ...data } = await searchService.searchField(name)

    res.status(code).json(data);
};


//       _____ JOBS _____

// Hiển thị bộ lọc tin bao gồm:
// Từ khóa tìm kiếm: input, lọc tin tuyển dụng có tiêu đề hoặc vị trí việc làm có chứa từ khóa.
// Lĩnh vực: select, lọc tin tuyển dụng có lĩnh vực được chọn.
// Sắp xếp theo: select, sắp xếp tin tuyển dụng theo các tiêu chí như: “Ngày đăng”, “Ngày hết hạn”, “Số lượng ứng viên”.
// Thứ tự sắp xếp: select, sắp xếp theo thứ tự “Tăng dần” hoặc “Giảm dần”.


const searchJobs = async (req, res) => {
    //console.log(' query:', req.query.filter)
    const { filter, field, sort } = req.query

    const { code, ...data } = await searchService.searchJobs(filter || '', field, sort)

    res.status(code).json(data);
}



const searchController = { searchFields, searchJobs }
export default searchController