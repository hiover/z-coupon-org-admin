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

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row> -->

    <el-table v-loading="loading" stripe :data="list">
      <el-table-column type="index" width="50" />
      <el-table-column label="id" align="center" prop="_id">
        <template slot-scope="scope">
          <el-link
            v-clipboard="scope.row._id"
            v-clipboard:success="copySuccess"
          >
            {{ scope.row._id }}
            <i class="el-icon-copy-document" />
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="openid" align="center" prop="openid">
        <template slot-scope="scope">
          <el-link
            v-clipboard="scope.row.openid"
            v-clipboard:success="copySuccess"
          >
            {{ scope.row.openid }}
            <i class="el-icon-copy-document" />
          </el-link>
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
  </div>
</template>

<script>
import { getOpenidList } from '@/api/openid'

export default {
  data() {
    return {
      // 总条数
      total: 0,
      queryParams: {
        page: 1,
        limit: 10,
        name: null,
        status: null
      },
      loading: false,
      list: []
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    copySuccess() {
      this.$notify.success('复制成功！')
    },
    async getList() {
      this.loading = true
      const { code, data, affectedDocs } = await getOpenidList(
        this.queryParams
      )
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    resetForm() {
      this.queryParams = {
        page: 1,
        limit: 10,
        name: null,
        status: null
      }
    },
    /** 新增按钮操作 */
    handleAdd() {}
  }
}
</script>

<style>

</style>
