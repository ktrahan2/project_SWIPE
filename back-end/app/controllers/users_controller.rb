class UsersController < ApplicationController

    skip_before_action :authorized, only: [:create]

    def index
        @users = User.all

        render json: @users, include: [:friends]
    end

    def show
        @user = User.find(params[:id])

        render json: @user, include: [:friends]
    end

    def profile
        render json: {user: current_user, friends: current_user.friends}
    end

    def create
        @user = User.new(user_params)

        if @user.valid?
            @user.save
            @token = JWT.encode({ user_id: @user.id }, Rails.application.secret_key_base)
            render json: {user: @user, friends: @user.friends, token: @token}, status: :created
        else
            render json: {errors: @user.errors.full_messages}, status: :not_acceptable
        end
    end

    private

    def user_params
        params.require(:user).permit(:name, :photo, :description, :project, :userType, :username, :password)
    end

end
