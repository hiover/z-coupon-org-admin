<template>
  <div class="app-container">
    <el-form
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="45px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入框架名称"
          clearable
          size="mini"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择框架状态"
          clearable
          size="mini"
        >
          <el-option label="上线" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="cyan"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" stripe :data="list">
      <el-table-column
        min-width="120"
        label="名称"
        show-overflow-tooltip
        align="center"
        show
        prop="name"
      >
        <template slot-scope="scope">
          <el-link
            v-clipboard="scope.row.name"
            v-clipboard:success="copySuccess"
          >
            {{ scope.row.name }}
            <i class="el-icon-copy-document" />
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        min-width="30"
        label="状态"
        show-overflow-tooltip
        align="center"
        show
        prop="status"
      >
        <template slot-scope="scope">
          <span
            :style="{ color: scope.row.status === 0 ? '#F56C6C' : '#67C23A' }"
          >
            {{ scope.row.status === 0 ? "下线" : "上架" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="宣传图" align="center" prop="image">
        <template slot-scope="scope">
          <img class="share-img" :src="scope.row.image">
        </template>
      </el-table-column>
      <el-table-column label="宣传主题" align="center" prop="content" />
      <el-table-column
        label="APPID"
        min-width="130"
        align="center"
        prop="targetAppid"
      >
        <template slot-scope="scope">
          <el-link
            v-clipboard="scope.row.targetAppid"
            v-clipboard:success="copySuccess"
          >
            {{ scope.row.targetAppid }}
            <i class="el-icon-copy-document" />
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        min-width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            :loading="scope.row.editloading"
            @click="handleUpdate(scope.row, scope.$index)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            :loading="scope.row.removeloading"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.limit"
      @pagination="getList"
    />

    <!-- 新增编辑对话框 -->
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="主题描述" prop="content">
              <el-input
                v-model="form.content"
                type="textarea"
                placeholder="请输入主题描述"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主题名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入主题名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="减免价格" prop="price">
              <el-input
                v-model="form.price"
                type="number"
                placeholder="请输入最高减免价格"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option label="小程序" value="mini" />
                <el-option label="网页" value="web" />
                <el-option label="APP" value="app" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state" required>
              <el-switch v-model="form.state" />
              {{ form.state ? "上架" : "下线" }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="链接地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入链接地址" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :span="24" display="flex" justify="center" align="center">
          <el-form-item>
            <el-upload
              v-if="!form.image"
              ref="image"
              class="upload-demo"
              drag
              :multiple="false"
              :limit="1"
              :action="url"
              :on-success="handleSuccess"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传图片文件，且不超过20M
              </div>
            </el-upload>
            <el-avatar
              v-else
              shape="square"
              :size="100"
              fit="fill"
              :src="form.image"
            />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col v-show="form.type === 'mini'" :span="24">
            <el-form-item label="APPID" prop="targetAppid">
              <el-input
                v-model="form.targetAppid"
                placeholder="请输入要打开的小程序APPID"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" prop="image">
            <el-form-item label="图片地址" prop="image">
              <el-input v-model="form.image" placeholder="请输入图片地址" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm"
        >确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCoupon,
  removeCoupon,
  addCoupon,
  updateCoupon,
  getCouponInfo
} from '@/api/coupon'

export default {
  data() {
    return {
      // url: `${process.env.VUE_APP_BASE_COUPON_API}/upload`,
      url: 'https://crypto2server-576164.service.tcloudbase.com/upload',
      file: { name: '' },
      loading: false,
      // 总条数
      total: 0,
      queryParams: {
        page: 1,
        limit: 10,
        name: null,
        status: null
      },
      list: [],
      //
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        state: true,
        image: '',
        type: 'mini',
        targetAppid: '',
        price: 0
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '名称主题不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '最高减免价格不能为空', trigger: 'blur' }
        ],
        url: [{ required: true, message: '链接不能为空', trigger: 'blur' }],
        appid: [{ required: true, message: 'appid不能为空', trigger: 'blur' }],
        image: [
          { required: true, message: '宣传图片不能为空', trigger: 'change' }
        ],
        content: [
          { required: true, message: '主题描述不能为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    from: {
      deep: true,
      handle(msg) {
        if (!msg.image) {
          this.$refs.image.clearFiles()
        }
      }
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    copySuccess() {
      this.$notify.success('复制成功！')
    },
    handleSuccess(file) {
      this.form = { ...this.form, image: file.fileList[0].download_url }
    },
    async getList() {
      this.loading = true
      const { code, data, affectedDocs } = await getCoupon(this.queryParams)
      this.loading = false
      this.total = affectedDocs
      if (!code) {
        this.list = data
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery()
    },
    handleUpdate(row) {
      this.reset()
      getCouponInfo({ _id: row._id }).then(res => {
        this.open = true
        this.title = '修改优惠券'
        this.form = Object.assign({}, this.form, res.data[0])
        this.form.state = Number(this.form.state) === 1
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加优惠券'
    },
    /** 提交按钮 */
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
        url: undefined,
        image: undefined,
        content: undefined,
        state: true,
        type: 'mini',
        targetAppid: undefined,
        price: 0
      }
    },
    submitForm: function() {
      if (this.loading) return
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          this.form.status = this.form.status ? 1 : 0
          this.form.price = Number(this.form.price)
          if (this.form._id !== undefined) {
            updateCoupon(this.form).then(response => {
              this.loading = false
              this.$message({
                message: '修改成功!',
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          } else {
            addCoupon(this.form).then(response => {
              this.loading = false

              this.$message({
                message: '新增成功!',
                type: 'success'
              })
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除策略框架编号为"' + row.name + '?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return removeCoupon({
            _id: row._id
          })
        })
        .then(() => {
          this.getList()
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
        })
    }
  }
}
</script>

<style scoped>
.share-img {
  height: 80px;
  /* width: 50px; */
}
</style>
